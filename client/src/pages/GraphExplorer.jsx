import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Settings2,
  Network,
  User,
  Wrench,
  Cpu,
  FolderKanban,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Route,
  BookmarkPlus,
  BookmarkCheck,
  X,
} from 'lucide-react';

import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import api from '../services/api';

const TYPE_META = {
  Role: {
    label: 'Role',
    color: '#a78bfa',
    bg: 'bg-violet-500/15',
    text: 'text-violet-300',
    ring: 'ring-violet-400/30',
    Icon: User,
  },
  Skill: {
    label: 'Skill',
    color: '#38bdf8',
    bg: 'bg-sky-500/15',
    text: 'text-sky-300',
    ring: 'ring-sky-400/30',
    Icon: Wrench,
  },
  Technology: {
    label: 'Technology',
    color: '#6366f1',
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-300',
    ring: 'ring-indigo-400/30',
    Icon: Cpu,
  },
  Project: {
    label: 'Project',
    color: '#10b981',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    ring: 'ring-emerald-400/30',
    Icon: FolderKanban,
  },
  LearningResource: {
    label: 'Learning Resource',
    color: '#f59e0b',
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    ring: 'ring-amber-400/30',
    Icon: BookOpen,
  },
};

const REL_META = {
  REQUIRES: { color: '#a78bfa', text: 'text-violet-300' },
  RELATED_TO: { color: '#38bdf8', text: 'text-sky-300' },
  USES: { color: '#818cf8', text: 'text-indigo-300' },
  DEMONSTRATES: { color: '#34d399', text: 'text-emerald-300' },
  BUILT_WITH: { color: '#fbbf24', text: 'text-amber-300' },
  LEARNED_THROUGH: { color: '#fb7185', text: 'text-rose-300' },
};

const typeMeta = (type) => TYPE_META[type] || TYPE_META.Skill;
const relMeta = (type) => REL_META[type] || REL_META.RELATED_TO;

// Sanitizes a relationship type into something safe to use inside an
// SVG id (marker ids can't contain characters like spaces).
const relId = (type) => (type || 'RELATED_TO').replace(/[^a-zA-Z0-9_-]/g, '');

const NODE_RADIUS = {
  Role: 42,
  Skill: 27,
  Technology: 27,
  Project: 29,
  LearningResource: 26,
};

const LEARNING_PATH_STORAGE_KEY = 'skillgraph-learning-path';

// Direct + one-hop-through connections are shown by default. Depth 2
// is needed to reach Technologies/Projects/LearningResources that sit
// behind a Skill (Role -> Skill -> Technology/Project/Resource).
const INITIAL_DEPTH = 1;


function collectSubgraphDepths(nodes, relationships, centerId, maxDepth) {
  const adjacency = new Map();
  nodes.forEach((node) => adjacency.set(node.id, []));

  relationships.forEach((rel) => {
    adjacency.get(rel.source)?.push(rel.target);
    adjacency.get(rel.target)?.push(rel.source);
  });

  const depths = new Map([[centerId, 0]]);
  let frontier = [centerId];

  for (let depth = 0; depth < maxDepth && frontier.length > 0; depth += 1) {
    const next = [];
    frontier.forEach((id) => {
      (adjacency.get(id) || []).forEach((neighborId) => {
        if (!depths.has(neighborId)) {
          depths.set(neighborId, depth + 1);
          next.push(neighborId);
        }
      });
    });
    frontier = next;
  }

  return depths;
}

// Given a raw depths map (id -> hop distance) from collectSubgraphDepths,
// strip out any *other* Role-type node that got pulled in via shared
// skills/technologies (e.g. two roles both requiring React). Sibling
// Roles aren't meaningful in a role-centric focused view, and — since
// every Role node is pinned to the exact same canvas center in
// getFixedNodePosition — leaving them in causes nodes to render stacked
// directly on top of each other.
function filterSiblingRoles(depthsOrIds, centerId, nodes) {
  const nodeById = new Map(nodes.map((item) => [item.id, item]));
  const ids = depthsOrIds instanceof Map ? Array.from(depthsOrIds.keys()) : Array.from(depthsOrIds);

  return new Set(
    ids.filter((id) => {
      if (id === centerId) return true;
      return nodeById.get(id)?.type !== 'Role';
    })
  );
}

// Breadth-first shortest path between two nodes, restricted to the
// node/link set that's passed in (so "highlight path" only lights up
// edges that are actually visible on the canvas).
function shortestPath(nodes, links, sourceId, targetId) {
  if (sourceId === targetId) return [sourceId];

  const adjacency = new Map();
  nodes.forEach((node) => adjacency.set(node.id, []));
  links.forEach((link) => {
    adjacency.get(link.source)?.push(link.target);
    adjacency.get(link.target)?.push(link.source);
  });

  const visited = new Set([sourceId]);
  const queue = [[sourceId]];

  while (queue.length > 0) {
    const path = queue.shift();
    const last = path[path.length - 1];

    for (const neighborId of adjacency.get(last) || []) {
      if (visited.has(neighborId)) continue;
      const nextPath = [...path, neighborId];
      if (neighborId === targetId) return nextPath;
      visited.add(neighborId);
      queue.push(nextPath);
    }
  }

  return null;
}

function clampLabel(label, maxLength = 18) {
  if (!label) return '';
  return label.length > maxLength ? `${label.slice(0, maxLength - 1)}…` : label;
}

/*
 * Fixed deterministic graph layout.
 *
 *          Skills (top)
 * Resources          Technologies
 * (left)    Role      (right)
 *          Projects (bottom)
 *
 * Wraps into multiple rows/columns when a band has more nodes than
 * fit cleanly on one line, so labels never overlap regardless of
 * how many nodes are visible at once.
 */
const MIN_NODE_GAP = 118;

function wrappedBandPosition({
  index,
  count,
  axisStart,
  axisLength,
  crossStart,
  crossStep,
  horizontal,
}) {
  const perLine = Math.max(1, Math.floor(axisLength / MIN_NODE_GAP) + 1);
  const line = Math.floor(index / perLine);
  const posInLine = index % perLine;
  const lineCount = Math.min(perLine, count - line * perLine);

  const usable = axisLength;
  const step = lineCount > 1 ? usable / (lineCount - 1) : 0;
  const along = lineCount === 1 ? axisStart + usable / 2 : axisStart + posInLine * step;
  const cross = crossStart + line * crossStep;

  return horizontal ? { x: along, y: cross } : { x: cross, y: along };
}

function getFixedNodePosition(node, nodes, centerX, centerY, width, height) {
  const paddingX = Math.max(70, width * 0.07);
  const paddingY = Math.max(70, height * 0.08);

  const skills = nodes.filter((item) => item.type === 'Skill');
  const technologies = nodes.filter((item) => item.type === 'Technology');
  const projects = nodes.filter((item) => item.type === 'Project');
  const resources = nodes.filter((item) => item.type === 'LearningResource');

  if (node.type === 'Role') {
    return { x: centerX, y: centerY };
  }

  const vGap = Math.max(180, height * 0.3);
  const hGap = Math.max(240, width * 0.27);
  // Large enough to clear a wrapped node's own label + type-text below
  // it (~50px) before the next row/column starts — otherwise row 2
  // nodes render on top of row 1's labels instead of below them.
  const rowStep = 96;
  const colStep = 150;

  // Corner buffer: keeps the horizontal bands (Skills/Projects) and the
  // vertical bands (Technology/Resources) from reaching into each
  // other's space in the four corners. Without this, a Skill node's
  // x-range and a Technology node's y-range can land on the exact same
  // point and render on top of each other.
  const CORNER_BUFFER = 100;

  // Skills/Projects only span the horizontal strip BETWEEN the
  // Technology column (right) and Resource column (left) — not the
  // full container width.
  const hBandStart = Math.max(paddingX, centerX - hGap + CORNER_BUFFER);
  const hBandEnd = Math.min(width - paddingX, centerX + hGap - CORNER_BUFFER);
  const hBandWidth = Math.max(320, hBandEnd - hBandStart);

  // Technology/Resources only span the vertical strip BETWEEN the
  // Skills row (top) and Projects row (bottom) — not the full
  // container height.
  const vBandStart = Math.max(paddingY, centerY - vGap + CORNER_BUFFER);
  const vBandEnd = Math.min(height - paddingY, centerY + vGap - CORNER_BUFFER);
  const vBandHeight = Math.max(220, vBandEnd - vBandStart);

  if (node.type === 'Skill') {
    const index = skills.findIndex((item) => item.id === node.id);

    return wrappedBandPosition({
      index,
      count: skills.length,
      axisStart: hBandStart,
      axisLength: hBandWidth,
      crossStart: Math.max(paddingY, centerY - vGap),
      crossStep: -rowStep,
      horizontal: true,
    });
  }

  if (node.type === 'Project') {
    const index = projects.findIndex((item) => item.id === node.id);

    return wrappedBandPosition({
      index,
      count: projects.length,
      axisStart: hBandStart,
      axisLength: hBandWidth,
      crossStart: Math.min(height - paddingY, centerY + vGap),
      crossStep: rowStep,
      horizontal: true,
    });
  }

  if (node.type === 'Technology') {
    const index = technologies.findIndex((item) => item.id === node.id);

    return wrappedBandPosition({
      index,
      count: technologies.length,
      axisStart: vBandStart,
      axisLength: vBandHeight,
      crossStart: Math.min(width - paddingX, centerX + hGap),
      crossStep: colStep,
      horizontal: false,
    });
  }

  if (node.type === 'LearningResource') {
    const index = resources.findIndex((item) => item.id === node.id);

    return wrappedBandPosition({
      index,
      count: resources.length,
      axisStart: vBandStart,
      axisLength: vBandHeight,
      crossStart: Math.max(paddingX, centerX - hGap),
      crossStep: -colStep,
      horizontal: false,
    });
  }

  return { x: centerX, y: centerY };
}

/*
 * Gentle outward curve between two points instead of a straight
 * line, so many edges radiating from center don't read as a dense
 * crosshatch of overlapping lines.
 *
 * `targetRadius` pulls the curve's endpoint back so it lands on the
 * target node's rim instead of its center — that's what makes room
 * for a visible arrowhead marker instead of it disappearing under
 * the node circle.
 */
function curvedPath(source, target, targetRadius = 0) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.hypot(dx, dy) || 1;

  const end = targetRadius
    ? {
        x: target.x - (dx / dist) * (targetRadius + 6),
        y: target.y - (dy / dist) * (targetRadius + 6),
      }
    : target;

  const midX = (source.x + end.x) / 2 - dy * 0.12;
  const midY = (source.y + end.y) / 2 + dx * 0.12;

  return {
    d: `M ${source.x} ${source.y} Q ${midX} ${midY} ${end.x} ${end.y}`,
    midX,
    midY,
  };
}

function loadStoredLearningPath() {
  try {
    const raw = localStorage.getItem(LEARNING_PATH_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function GraphExplorer() {
  const [fullNodes, setFullNodes] = useState([]);
  const [fullLinks, setFullLinks] = useState([]);

  const [visibleIds, setVisibleIds] = useState(null);
  const [showEntireGraph, setShowEntireGraph] = useState(false);

  const [selectedNode, setSelectedNode] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('');

  const [dims, setDims] = useState({ width: 1100, height: 800 });
  const [zoom, setZoom] = useState(1);

  const [showLegend, setShowLegend] = useState(true);
  const [highlightPathOn, setHighlightPathOn] = useState(false);
  const [learningPathIds, setLearningPathIds] = useState(loadStoredLearningPath);

  // Which relationship-type groups are expanded in the sidebar.
  // Collapsed by default — the panel shows counts first, like
  // "5 Skills / 3 Technologies", and expands on click.
  const [expandedGroups, setExpandedGroups] = useState(() => new Set());

  const containerRef = useRef(null);
  const focusNodeRef = useRef(null);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/graph');
      const payload = response.data?.data || { nodes: [], relationships: [] };

      const normalizedNodes = (payload.nodes || []).map((node) => ({
        id: String(node.id),
        label: node.label || 'Unknown',
        type: node.type || 'Unknown',
        description: node.description || '',
      }));

      const normalizedRelationships = (payload.relationships || []).map((rel) => ({
        source: String(rel.source),
        target: String(rel.target),
        type: rel.type || 'RELATED_TO',
      }));

      setFullNodes(normalizedNodes);
      setFullLinks(normalizedRelationships);

      // No node is auto-focused — the canvas starts empty with a
      // prompt until the user searches for and picks one themselves.
      focusNodeRef.current = null;
      setSelectedNode(null);
      setShowEntireGraph(false);
      setVisibleIds(new Set());
    } catch (fetchError) {
      console.error('Failed to load graph data:', fetchError);
      setError('Unable to load the knowledge graph right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;

    // Fill whatever space the parent grants — if the viewport is
    // taller/wider than the default, the canvas (and its viewBox)
    // grows to match exactly, so the graph always renders edge to
    // edge instead of floating in a fixed-size box.
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDims({
          width: Math.max(500, width),
          height: Math.max(500, height),
        });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const effectiveVisibleIds = showEntireGraph ? null : visibleIds;

  const displayedNodes = useMemo(() => {
    if (!effectiveVisibleIds) return fullNodes;
    return fullNodes.filter((node) => effectiveVisibleIds.has(node.id));
  }, [fullNodes, effectiveVisibleIds]);

  const displayedLinks = useMemo(() => {
    const idSet = effectiveVisibleIds || new Set(fullNodes.map((node) => node.id));
    return fullLinks
      .filter((rel) => idSet.has(rel.source) && idSet.has(rel.target))
      .map((rel) => ({ source: rel.source, target: rel.target, type: rel.type }));
  }, [fullLinks, effectiveVisibleIds, fullNodes]);

  const nodePositions = useMemo(() => {
    const positions = new Map();
    const centerX = dims.width / 2;
    const centerY = dims.height / 2;

    displayedNodes.forEach((node) => {
      positions.set(
        node.id,
        getFixedNodePosition(node, displayedNodes, centerX, centerY, dims.width, dims.height)
      );
    });

    return positions;
  }, [displayedNodes, dims.width, dims.height]);

  // Radius lookup for whatever's currently on the canvas — used so edges
  // know how far to pull their endpoint back to clear the target node
  // (see curvedPath) and reveal the arrowhead marker.
  const nodeRadiusById = useMemo(() => {
    const map = new Map();
    displayedNodes.forEach((node) => map.set(node.id, NODE_RADIUS[node.type] || 24));
    return map;
  }, [displayedNodes]);

  // Total link count per node across the WHOLE graph (not just what's
  // currently displayed) — drives the connectivity tick-ring drawn
  // around every node, a small at-a-glance "how connected is this"
  // gauge that reflects real data rather than decoration.
  const nodeDegrees = useMemo(() => {
    const map = new Map();
    fullLinks.forEach((rel) => {
      map.set(rel.source, (map.get(rel.source) || 0) + 1);
      map.set(rel.target, (map.get(rel.target) || 0) + 1);
    });
    return map;
  }, [fullLinks]);

  // Full-graph positions at a fixed small scale, used only for the minimap
  // so it always shows the whole network regardless of the focused view.
  const minimapPositions = useMemo(() => {
    const MW = 148;
    const MH = 96;
    const positions = new Map();
    fullNodes.forEach((node) => {
      positions.set(node.id, getFixedNodePosition(node, fullNodes, MW / 2, MH / 2, MW, MH));
    });
    return { positions, width: MW, height: MH };
  }, [fullNodes]);

  const typeCounts = useMemo(() => {
    const counts = {};
    fullNodes.forEach((node) => {
      counts[node.type] = (counts[node.type] || 0) + 1;
    });
    return counts;
  }, [fullNodes]);

  const selectedRelationshipsByType = useMemo(() => {
    if (!selectedNode) return [];
    const grouped = {};

    fullLinks.forEach((relationship) => {
      const isSource = relationship.source === selectedNode.id;
      const isTarget = relationship.target === selectedNode.id;
      if (!isSource && !isTarget) return;

      const otherId = isSource ? relationship.target : relationship.source;
      const otherNode = fullNodes.find((node) => node.id === otherId);
      if (!otherNode) return;

      if (!grouped[relationship.type]) grouped[relationship.type] = [];
      grouped[relationship.type].push(otherNode);
    });

    return Object.entries(grouped);
  }, [fullLinks, fullNodes, selectedNode]);

  // "Top connections" for the selected node — ranks its neighbors by how
  // central each neighbor is in the wider graph (its own degree), so the
  // panel can show a proportional bar without inventing numbers that
  // aren't in the underlying data.
  const topConnections = useMemo(() => {
    if (!selectedNode) return [];

    const degreeOf = (nodeId) =>
      fullLinks.filter((rel) => rel.source === nodeId || rel.target === nodeId).length;

    const neighborIds = new Set();
    fullLinks.forEach((rel) => {
      if (rel.source === selectedNode.id) neighborIds.add(rel.target);
      if (rel.target === selectedNode.id) neighborIds.add(rel.source);
    });

    const entries = Array.from(neighborIds)
      .map((id) => ({ node: fullNodes.find((n) => n.id === id), degree: degreeOf(id) }))
      .filter((entry) => entry.node)
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 5);

    const max = entries[0]?.degree || 1;
    return entries.map((entry) => ({ ...entry, pct: Math.max(8, Math.round((entry.degree / max) * 100)) }));
  }, [selectedNode, fullLinks, fullNodes]);

  const searchMatches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return fullNodes.filter((node) => node.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, fullNodes]);

  const hasFocus = Boolean(focusNodeRef.current) || showEntireGraph;
  const showGraph = !loading && !error && hasFocus && displayedNodes.length > 0;
  const showPrompt = !loading && !error && !hasFocus;

  const fitGraph = useCallback(() => setZoom(1), []);

  const focusOnNode = useCallback(
    (node) => {
      focusNodeRef.current = node;

      const depths = collectSubgraphDepths(fullNodes, fullLinks, node.id, INITIAL_DEPTH);

      // Drop any other Role-type node pulled in via shared skills/tech —
      // this view is meant to show *this* role's neighborhood, and other
      // Role nodes would also collide visually since Role positions are
      // always pinned to the canvas center (see getFixedNodePosition).
      const filteredIds = filterSiblingRoles(depths, node.id, fullNodes);

      setVisibleIds(filteredIds);
      setSelectedNode(node);
      setShowEntireGraph(false);
      setQuery('');
      setZoom(1);
      setHighlightPathOn(false);
      // Reset expanded groups for the newly focused node.
      setExpandedGroups(new Set());
    },
    [fullNodes, fullLinks]
  );

  const handleReset = () => {
    if (focusNodeRef.current) {
      focusOnNode(focusNodeRef.current);
    } else {
      setSelectedNode(null);
      setVisibleIds(new Set());
      setShowEntireGraph(false);
    }
    setZoom(1);
  };

  const toggleEntireGraph = () => {
    setShowEntireGraph((previous) => {
      const next = !previous;

      if (!next && focusNodeRef.current) {
        const depths = collectSubgraphDepths(
          fullNodes,
          fullLinks,
          focusNodeRef.current.id,
          INITIAL_DEPTH
        );
        // Same sibling-Role filtering as focusOnNode — otherwise
        // switching back from "Expand All" to focused view can
        // reintroduce an overlapping Role node.
        setVisibleIds(filterSiblingRoles(depths, focusNodeRef.current.id, fullNodes));
      }

      return next;
    });
    setZoom(1);
  };

  const handleZoom = (factor) => {
    setZoom((previous) => Math.min(1.8, Math.max(0.75, previous * factor)));
  };

  /*
   * Clicking any node re-centers the graph on it (not just Roles),
   * so the view always stays a small, readable neighborhood rather
   * than accumulating every node ever visited.
   */
  const focusNode = useCallback(
    (node) => {
      if (node.id !== focusNodeRef.current?.id) {
        focusOnNode(node);
        return;
      }

      setSelectedNode(node);
      setQuery('');
    },
    [focusOnNode]
  );

  const handleNodeClick = useCallback((node) => focusNode(node), [focusNode]);

  const isSelectedRelationship = useCallback(
    (link) => {
      if (!selectedNode) return false;
      return link.source === selectedNode.id || link.target === selectedNode.id;
    },
    [selectedNode]
  );

  const toggleGroup = (type) => {
    setExpandedGroups((previous) => {
      const next = new Set(previous);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const toggleLearningPath = (nodeId) => {
    setLearningPathIds((previous) => {
      const next = new Set(previous);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      try {
        localStorage.setItem(LEARNING_PATH_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // Storage can fail (private browsing, quota) — the toggle still
        // works for the current session even if it isn't persisted.
      }
      return next;
    });
  };

  const learningPathNodes = useMemo(
    () => fullNodes.filter((node) => learningPathIds.has(node.id)),
    [fullNodes, learningPathIds]
  );

  // Path between the focused root and the currently selected node —
  // only computed while "Highlight Path" is on, and only across
  // whatever is currently drawn on the canvas.
  const highlightedPath = useMemo(() => {
    if (!highlightPathOn || !selectedNode || !focusNodeRef.current) return null;
    if (selectedNode.id === focusNodeRef.current.id) return null;
    return shortestPath(displayedNodes, displayedLinks, focusNodeRef.current.id, selectedNode.id);
  }, [highlightPathOn, selectedNode, displayedNodes, displayedLinks]);

  const highlightedNodeIds = useMemo(
    () => new Set(highlightedPath || []),
    [highlightedPath]
  );

  const highlightedEdgeKeys = useMemo(() => {
    if (!highlightedPath) return new Set();
    const keys = new Set();
    for (let i = 0; i < highlightedPath.length - 1; i += 1) {
      keys.add(`${highlightedPath[i]}|${highlightedPath[i + 1]}`);
      keys.add(`${highlightedPath[i + 1]}|${highlightedPath[i]}`);
    }
    return keys;
  }, [highlightedPath]);

  const canHighlightPath = Boolean(
    selectedNode && focusNodeRef.current && selectedNode.id !== focusNodeRef.current.id
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 bg-slate-950 px-3 py-2 md:px-5 md:py-3">
      {/* PAGE HEADER — kept compact so the canvas gets almost all the
          vertical space; this whole block is one flex row, not a
          stacked title + separate control row, to save height. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white md:text-xl">
            Knowledge Graph
          </h1>

          <p className="mt-0.5 text-xs text-slate-400">
            {showEntireGraph
              ? 'Visualize how skills, technologies and resources are connected.'
              : focusNodeRef.current
              ? `Focused on ${focusNodeRef.current.label} — select a node to inspect its relationships.`
              : 'Search for a role, skill, technology, project, or resource to begin.'}
          </p>
        </div>

        {/* GRAPH CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fitGraph}
            disabled={!showGraph}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 disabled:opacity-40"
          >
            <Maximize2 size={14} />
            Fit View
            <ChevronDown size={13} className="text-slate-600" />
          </button>

          <button
            type="button"
            onClick={toggleEntireGraph}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition ${
              showEntireGraph
                ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-200'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Network size={14} />
            {showEntireGraph ? 'Focused View' : 'Expand All'}
          </button>

          <button
            type="button"
            onClick={() => setHighlightPathOn((prev) => !prev)}
            disabled={!canHighlightPath}
            className={`flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold shadow-lg shadow-indigo-950/40 transition disabled:cursor-not-allowed disabled:opacity-40 ${
              highlightPathOn
                ? 'bg-violet-500 text-white hover:bg-violet-400'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500'
            }`}
          >
            <Route size={14} />
            {highlightPathOn ? 'Hide Path' : 'Highlight Path'}
          </button>
        </div>
      </div>

      {/* MAIN GRAPH + SIDEBAR — fills the remaining viewport, full bleed */}
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* GRAPH CANVAS */}
        <div
          ref={containerRef}
          className="relative isolate h-full min-h-0 w-full overflow-hidden rounded-xl border border-slate-800 bg-[#070b1c]"
        >
          {/* TOP LABEL */}
          <div className="pointer-events-none absolute left-5 top-4 z-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Knowledge Graph
            </p>
          </div>

          {/* LAYOUT GUIDE LABELS */}
          {showGraph && (
            <>
              <div className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-400/60">
                Skills
              </div>
              <div className="pointer-events-none absolute right-5 top-1/2 z-10 -translate-y-1/2 rotate-90 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400/60">
                Technologies
              </div>
              <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400/60">
                Projects
              </div>
              <div className="pointer-events-none absolute bottom-1/2 left-5 z-10 translate-y-1/2 -rotate-90 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400/60">
                Resources
              </div>
            </>
          )}

          {/* LOADING */}
          {loading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 px-8">
              <LoadingState count={4} variant="list" />
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 px-8">
              <ErrorState
                title="Graph failed to load"
                message={error}
                action={
                  <button
                    type="button"
                    onClick={fetchGraph}
                    className="rounded-md border border-indigo-400/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-indigo-200 transition hover:bg-indigo-500/20"
                  >
                    Retry
                  </button>
                }
              />
            </div>
          )}

          {/* PROMPT — shown until the user selects a node; no default graph */}
          {showPrompt && (
            <div className="absolute inset-0 z-20 flex items-center justify-center px-8">
              <EmptyState
                title="Select a node to explore"
                description="Search for a role, skill, technology, project, or learning resource on the right to see its connections — or switch to “Expand All”."
              />
            </div>
          )}

          {/* EMPTY (data loaded but genuinely nothing to show) */}
          {!loading && !error && hasFocus && displayedNodes.length === 0 && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 px-8">
              <EmptyState
                title="No graph data available"
                description="The CognoDB graph is empty or no relationships are currently available."
              />
            </div>
          )}

          {/* SVG GRAPH */}
          {showGraph && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${dims.width} ${dims.height}`}
              className="block h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {Object.entries(TYPE_META).map(([key, meta]) => (
                  <radialGradient key={key} id={`glow-${key}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={meta.color} stopOpacity="0.55" />
                    <stop offset="60%" stopColor={meta.color} stopOpacity="0.12" />
                    <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
                  </radialGradient>
                ))}

                {/* Glossy top-left highlight overlaid on every node — gives
                    the flat color fill some dimension without needing a
                    per-type gradient. */}
                <radialGradient id="node-sheen" cx="35%" cy="28%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>

                {/* Directional arrowheads, one per relationship type so the
                    arrow reads as the same color as its edge. */}
                {Object.entries(REL_META).map(([key, meta]) => (
                  <marker
                    key={key}
                    id={`arrow-${relId(key)}`}
                    viewBox="0 0 10 10"
                    refX="8.5"
                    refY="5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill={meta.color} />
                  </marker>
                ))}
              </defs>

              <g
                transform={`
                  translate(${(dims.width - dims.width * zoom) / 2} ${
                  (dims.height - dims.height * zoom) / 2
                })
                  scale(${zoom})
                `}
              >
                {/* RELATIONSHIP CURVES */}
                {displayedLinks.map((link, index) => {
                  const source = nodePositions.get(link.source);
                  const target = nodePositions.get(link.target);
                  if (!source || !target) return null;

                  const meta = relMeta(link.type);
                  const selected = isSelectedRelationship(link);
                  const onPath = highlightedEdgeKeys.has(`${link.source}|${link.target}`);
                  const dimmed = highlightPathOn && highlightedPath && !onPath;
                  const emphasized = onPath || (selected && !highlightPathOn);
                  const targetRadius = nodeRadiusById.get(link.target) || 24;
                  const { d } = curvedPath(source, target, targetRadius);

                  return (
                    <g key={`${link.source}-${link.target}-${link.type}-${index}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={meta.color}
                        strokeWidth={onPath ? 3 : emphasized ? 2.1 : 1}
                        opacity={dimmed ? 0.06 : emphasized ? 0.95 : 0.22}
                        strokeLinecap="round"
                        markerEnd={`url(#arrow-${relId(link.type)})`}
                      />

                      {/* Traveling pulse — only while this edge is part of
                          an actively highlighted path, so "Highlight Path"
                          reads as energy flowing from the focused root
                          toward the selected node rather than a static
                          color change. */}
                      {onPath && (
                        <circle r="3.2" fill="#f8fafc">
                          <animateMotion dur="1s" repeatCount="indefinite" path={d} />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* NODES */}
                {displayedNodes.map((node) => {
                  const position = nodePositions.get(node.id);
                  if (!position) return null;

                  const meta = typeMeta(node.type);
                  const Icon = meta.Icon;
                  const radius = NODE_RADIUS[node.type] || 24;
                  const isSelected = selectedNode?.id === node.id;
                  const isHover = hoverNode?.id === node.id;
                  const onPath = highlightedNodeIds.has(node.id);
                  const dimmed = highlightPathOn && highlightedPath && !onPath;
                  const inLearningPath = learningPathIds.has(node.id);

                  // Connectivity gauge: a dashed ring whose tick count
                  // scales with how many relationships this node actually
                  // has, so busier nodes read as visibly busier on the
                  // canvas itself — not just in the sidebar's link counts.
                  const degree = nodeDegrees.get(node.id) || 0;
                  const tickRadius = radius + 8;
                  const tickCount = Math.min(12, Math.max(3, degree));
                  const circumference = 2 * Math.PI * tickRadius;
                  const dashOn = (circumference / tickCount) * 0.5;
                  const dashOff = circumference / tickCount - dashOn;

                  const iconSize = node.type === 'Role' ? 20 : 14;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${position.x}, ${position.y})`}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => setHoverNode(node)}
                      onMouseLeave={() => setHoverNode(null)}
                      style={{ cursor: 'pointer', opacity: dimmed ? 0.15 : 1 }}
                    >
                      {/* Ambient glow behind every node — the signature look of this view */}
                      <circle r={radius * 2.4} fill={`url(#glow-${node.type})`} />

                      {/* Connectivity tick ring */}
                      <circle
                        r={tickRadius}
                        fill="none"
                        stroke={meta.color}
                        strokeWidth="1.5"
                        strokeDasharray={`${dashOn} ${dashOff}`}
                        opacity={dimmed ? 0.08 : 0.45}
                      />

                      {(isSelected || onPath) && (
                        <>
                          <circle
                            r={radius + 12}
                            fill="none"
                            stroke="#f8fafc"
                            strokeWidth="2"
                            opacity="0.95"
                          />
                          <circle
                            r={radius + 16}
                            fill="none"
                            stroke={meta.color}
                            strokeWidth="1"
                            opacity="0.5"
                          />
                        </>
                      )}

                      {isHover && !isSelected && (
                        <circle
                          r={radius + 5}
                          fill="none"
                          stroke="rgba(255,255,255,0.5)"
                          strokeWidth="1.5"
                        />
                      )}

                      <circle r={radius} fill={meta.color} fillOpacity="0.96" stroke="#0f172a" strokeWidth="2" />

                      <circle
                        r={radius - 4}
                        fill="none"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1"
                      />

                      {/* Glossy highlight overlay for a bit of instrument-glass depth */}
                      <circle r={radius} fill="url(#node-sheen)" />

                      <foreignObject
                        x={-iconSize / 2}
                        y={-iconSize / 2}
                        width={iconSize}
                        height={iconSize}
                        style={{ pointerEvents: 'none', overflow: 'visible' }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={iconSize} color="#ffffff" strokeWidth={2.25} />
                        </div>
                      </foreignObject>

                      {inLearningPath && (
                        <circle
                          cx={radius - 6}
                          cy={-radius + 6}
                          r={7}
                          fill="#0f172a"
                          stroke="#f8fafc"
                          strokeWidth="1.5"
                        />
                      )}

                      <text
                        x="0"
                        y={radius + (node.type === 'Role' ? 24 : 18)}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize={node.type === 'Role' ? 13 : 11}
                        fontWeight="700"
                        stroke="#070b1c"
                        strokeWidth="3"
                        paintOrder="stroke"
                      >
                        {clampLabel(node.label, node.type === 'Role' ? 24 : 16)}
                      </text>

                      <text
                        x="0"
                        y={radius + (node.type === 'Role' ? 40 : 33)}
                        textAnchor="middle"
                        fill="rgba(203,213,225,0.72)"
                        fontSize="9"
                        fontWeight="500"
                      >
                        {meta.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}

          {/* LEGEND */}
          {showGraph && showLegend && (
            <div className="absolute bottom-16 left-4 z-20 rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2.5 shadow-xl backdrop-blur">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Legend
              </p>

              <div className="space-y-1.5">
                {Object.values(TYPE_META).map((meta) => (
                  <div key={meta.label} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="text-[11px] text-slate-300">{meta.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOTTOM-LEFT CANVAS TOOLBAR */}
          {showGraph && (
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-0.5 rounded-lg border border-slate-800 bg-slate-950/90 p-1 shadow-xl backdrop-blur">
              <button
                type="button"
                onClick={fitGraph}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-800"
                aria-label="Fit graph"
                title="Fit graph"
              >
                <Maximize2 size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(0.85)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-800"
                aria-label="Zoom out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="w-10 select-none text-center text-[10px] font-semibold text-slate-400">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => handleZoom(1.15)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-800"
                aria-label="Zoom in"
              >
                <ZoomIn size={13} />
              </button>
              <span className="mx-0.5 h-4 w-px bg-slate-800" />
              <button
                type="button"
                onClick={handleReset}
                disabled={!hasFocus}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
                aria-label="Recenter on focused node"
                title="Recenter"
              >
                <Crosshair size={13} />
              </button>
              <button
                type="button"
                onClick={() => setShowLegend((prev) => !prev)}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-slate-800 ${
                  showLegend ? 'text-indigo-300' : 'text-slate-300'
                }`}
                aria-label="Toggle legend"
                title="Toggle legend"
              >
                <Settings2 size={13} />
              </button>
            </div>
          )}

          {/* MINIMAP */}
          {showGraph && (
            <div className="absolute bottom-4 right-4 z-20 rounded-lg border border-slate-800 bg-slate-950/90 p-2 shadow-xl backdrop-blur">
              <svg width={148} height={96} viewBox="0 0 148 96">
                <rect x="0" y="0" width="148" height="96" rx="6" fill="#0b1224" />
                {/* Only the edges touching whatever's currently on the main canvas
                    are drawn — plotting all ~{fullLinks.length} relationships at
                    once turns this into an unreadable tangle. */}
                {displayedLinks.map((link, index) => {
                  const source = minimapPositions.positions.get(link.source);
                  const target = minimapPositions.positions.get(link.target);
                  if (!source || !target) return null;
                  return (
                    <line
                      key={`mini-${link.source}-${link.target}-${index}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="#475569"
                      strokeWidth="0.6"
                      opacity="0.7"
                    />
                  );
                })}
                {fullNodes.map((node) => {
                  const position = minimapPositions.positions.get(node.id);
                  if (!position) return null;
                  const meta = typeMeta(node.type);
                  const isVisible = displayedNodes.some((item) => item.id === node.id);
                  return (
                    <circle
                      key={`mini-node-${node.id}`}
                      cx={position.x}
                      cy={position.y}
                      r={node.type === 'Role' ? 3 : 1.6}
                      fill={meta.color}
                      opacity={isVisible ? 1 : 0.25}
                    />
                  );
                })}
              </svg>
            </div>
          )}

          {/* GRAPH COUNTER */}
          {showGraph && (
            <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2 text-[11px] text-slate-400 backdrop-blur">
              <span>
                Nodes: <span className="font-semibold text-slate-200">{displayedNodes.length}</span>
              </span>
              <span className="h-3 w-px bg-slate-700" />
              <span>
                Relationships:{' '}
                <span className="font-semibold text-slate-200">{displayedLinks.length}</span>
              </span>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
          {/* SEARCH */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Search Node
            </p>

            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60"
              />
            </div>

            {searchMatches.length > 0 && (
              <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-1">
                {searchMatches.map((node) => {
                  const meta = typeMeta(node.type);

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => focusNode(node)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-slate-300 transition hover:bg-slate-800"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      <span className="truncate">{node.label}</span>
                      <span className="ml-auto text-[10px] text-slate-600">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* NODE TYPES */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Node Types
            </p>

            <div className="space-y-1.5">
              {Object.entries(TYPE_META).map(([key, meta]) => {
                const Icon = meta.Icon;

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 ring-1 ${meta.bg} ${meta.ring}`}
                  >
                    <span className={`flex items-center gap-2 text-xs font-medium ${meta.text}`}>
                      <Icon size={14} />
                      {meta.label}
                    </span>
                    <span className="text-xs text-slate-400">{typeCounts[key] || 0}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SELECTED NODE */}
          {selectedNode && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Node Details
              </p>

              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ring-white/10"
                  style={{ backgroundColor: typeMeta(selectedNode.type).color }}
                >
                  {(() => {
                    const Icon = typeMeta(selectedNode.type).Icon;
                    return <Icon size={16} className="text-white" />;
                  })()}
                </span>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {selectedNode.label}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {typeMeta(selectedNode.type).label}
                  </p>
                </div>
              </div>

              {selectedNode.description && (
                <p className="mt-3 text-xs leading-5 text-slate-400">{selectedNode.description}</p>
              )}

              {/* CONNECTED — summarized counts, expand to see names */}
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Connected To
                </p>

                {selectedRelationshipsByType.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedRelationshipsByType.map(([type, nodes]) => {
                      const isOpen = expandedGroups.has(type);
                      const meta = relMeta(type);

                      return (
                        <div
                          key={type}
                          className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60"
                        >
                          <button
                            type="button"
                            onClick={() => toggleGroup(type)}
                            className="flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-slate-800/60"
                          >
                            <span className={`text-xs font-semibold ${meta.text}`}>
                              {nodes.length} {type.replace(/_/g, ' ').toLowerCase()}
                            </span>

                            {isOpen ? (
                              <ChevronDown size={14} className="text-slate-500" />
                            ) : (
                              <ChevronRight size={14} className="text-slate-500" />
                            )}
                          </button>

                          {isOpen && (
                            <ul className="space-y-0.5 border-t border-slate-800 p-1.5">
                              {nodes.map((node) => (
                                <li key={node.id}>
                                  <button
                                    type="button"
                                    onClick={() => focusNode(node)}
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-300 transition hover:bg-slate-800"
                                  >
                                    <ArrowRight size={12} className="shrink-0 text-slate-600" />
                                    <span className="truncate">{node.label}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No connected relationships</p>
                )}
              </div>

              {/* TOP CONNECTIONS — proportional bars ranked by how central each neighbor is */}
              {topConnections.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Top Connections
                  </p>

                  <div className="space-y-2">
                    {topConnections.map(({ node, pct, degree }) => {
                      const meta = typeMeta(node.type);
                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => focusNode(node)}
                          className="block w-full text-left"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="truncate text-xs text-slate-300">{node.label}</span>
                            <span className="ml-2 shrink-0 text-[10px] text-slate-500">
                              {degree} {degree === 1 ? 'link' : 'links'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: meta.color }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHighlightPathOn((prev) => !prev)}
                  disabled={!canHighlightPath}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Route size={13} />
                  {highlightPathOn ? 'Hide Path' : 'View Path'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleLearningPath(selectedNode.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    learningPathIds.has(selectedNode.id)
                      ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {learningPathIds.has(selectedNode.id) ? (
                    <BookmarkCheck size={13} />
                  ) : (
                    <BookmarkPlus size={13} />
                  )}
                  {learningPathIds.has(selectedNode.id) ? 'Added' : 'Add to Learning Path'}
                </button>
              </div>
            </div>
          )}

          {/* MY LEARNING PATH */}
          {learningPathNodes.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                My Learning Path
              </p>

              <ul className="space-y-1">
                {learningPathNodes.map((node) => {
                  const meta = typeMeta(node.type);
                  return (
                    <li
                      key={node.id}
                      className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-slate-300"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      <button
                        type="button"
                        onClick={() => focusNode(node)}
                        className="min-w-0 flex-1 truncate text-left transition hover:text-white"
                      >
                        {node.label}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleLearningPath(node.id)}
                        className="shrink-0 text-slate-600 transition hover:text-rose-300"
                        aria-label={`Remove ${node.label} from learning path`}
                      >
                        <X size={12} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
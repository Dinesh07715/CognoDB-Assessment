import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import SkillCard from '../components/SkillCard';
import TechnologyBadge from '../components/TechnologyBadge';
import ProjectCard from '../components/ProjectCard';
import RoleCard from '../components/RoleCard';
import ResourceCard from '../components/ResourceCard';
import SectionHeader from '../components/SectionHeader';

import api from '../services/api';

export default function RoleDetails() {
  const { roleName } = useParams();

  const [role, setRole] = useState(null);
  const [allRoles, setAllRoles] = useState([]);

  const [skills, setSkills] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [relatedRoles, setRelatedRoles] = useState([]);
  const [learningResources, setLearningResources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRoleDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const decodedRoleName = decodeURIComponent(roleName || '').trim();

        console.log('Loading role:', decodedRoleName);

        // ==================================================
        // 1. GET ALL ROLES
        // ==================================================

        const rolesResponse = await api.get('/roles');

        const rolesData =
          rolesResponse?.data?.data ||
          rolesResponse?.data ||
          [];

        const rolesArray = Array.isArray(rolesData)
          ? rolesData
          : [];

        setAllRoles(rolesArray);

        // ==================================================
        // 2. FIND SELECTED ROLE
        // ==================================================

        const selectedRole = rolesArray.find(
          (item) =>
            item?.name?.toLowerCase() ===
            decodedRoleName.toLowerCase()
        );

        if (!selectedRole) {
          throw new Error(
            `Role "${decodedRoleName}" was not found.`
          );
        }

        console.log('Selected role:', selectedRole);

        setRole(selectedRole);

        // ==================================================
        // 3. GET ROLE SKILLS
        // ==================================================

        const skillsResponse = await api.get(
          `/roles/${encodeURIComponent(decodedRoleName)}/skills`
        );

        const skillsData =
          skillsResponse?.data?.data ||
          skillsResponse?.data ||
          [];

        setSkills(
          Array.isArray(skillsData)
            ? skillsData
            : []
        );

        // ==================================================
        // 4. GET ROLE TECHNOLOGIES
        // ==================================================

        const technologiesResponse = await api.get(
          `/roles/${encodeURIComponent(decodedRoleName)}/technologies`
        );

        const technologiesData =
          technologiesResponse?.data?.data ||
          technologiesResponse?.data ||
          [];

        console.log(
          'Role technologies:',
          technologiesData
        );

        setTechnologies(
          Array.isArray(technologiesData)
            ? technologiesData
            : []
        );

        // ==================================================
        // 5. GET ROLE PROJECTS
        // ==================================================

        const projectsResponse = await api.get(
          `/roles/${encodeURIComponent(decodedRoleName)}/projects`
        );

        const projectsData =
          projectsResponse?.data?.data ||
          projectsResponse?.data ||
          [];

        console.log(
          'Role projects:',
          projectsData
        );

        setProjects(
          Array.isArray(projectsData)
            ? projectsData
            : []
        );

        // ==================================================
        // 6. GET RELATED ROLES
        // ==================================================

        const relatedResponse = await api.get(
          `/roles/${encodeURIComponent(decodedRoleName)}/related`
        );

        const relatedData =
          relatedResponse?.data?.data ||
          relatedResponse?.data ||
          [];

        console.log(
          'Related roles:',
          relatedData
        );

        setRelatedRoles(
          Array.isArray(relatedData)
            ? relatedData
            : []
        );

        // ==================================================
        // 7. GET LEARNING RESOURCES
        // ==================================================

        if (
          Array.isArray(skillsData) &&
          skillsData.length > 0
        ) {
          const resourceResults = await Promise.all(
            skillsData.map(async (skill) => {
              const skillName =
                typeof skill === 'string'
                  ? skill
                  : skill?.name ||
                    skill?.skillName;

              if (!skillName) {
                return [];
              }

              try {
                const resourceResponse = await api.get(
                  `/roles/skills/${encodeURIComponent(
                    skillName
                  )}/resources`
                );

                const resourceData =
                  resourceResponse?.data?.data ||
                  resourceResponse?.data ||
                  [];

                return Array.isArray(resourceData)
                  ? resourceData
                  : [];
              } catch (resourceError) {
                console.warn(
                  `Could not load resources for ${skillName}`,
                  resourceError
                );

                return [];
              }
            })
          );

          const flattenedResources =
            resourceResults.flat();

          // Remove duplicate resources
          const uniqueResources =
            flattenedResources.filter(
              (resource, index, array) => {
                const currentKey =
                  resource?.id ||
                  resource?.url ||
                  resource?.name ||
                  resource?.title;

                return (
                  index ===
                  array.findIndex((item) => {
                    const itemKey =
                      item?.id ||
                      item?.url ||
                      item?.name ||
                      item?.title;

                    return itemKey === currentKey;
                  })
                );
              }
            );

          setLearningResources(uniqueResources);
        } else {
          setLearningResources([]);
        }
      } catch (err) {
        console.error(
          'Failed to load role details:',
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load role details.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (roleName) {
      loadRoleDetails();
    }
  }, [roleName]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

          <p className="text-slate-400">
            Loading role details...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-lg rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">
            Unable to load role
          </h2>

          <p className="mt-3 text-sm text-red-200">
            {error}
          </p>

          <p className="mt-4 text-xs text-slate-400">
            Requested role:{' '}
            {decodeURIComponent(roleName || '')}
          </p>
        </div>
      </div>
    );
  }

  if (!role) {
    return null;
  }

  // ======================================================
  // NORMALIZE SKILLS
  // ======================================================

  const normalizedSkills = skills.map(
    (skill, index) => {
      if (typeof skill === 'string') {
        return {
          id: skill,
          name: skill,
          description:
            `Required skill for ${role.name}.`,
        };
      }

      return {
        ...skill,

        id:
          skill?.id ||
          skill?.name ||
          skill?.skillName ||
          `skill-${index}`,

        name:
          skill?.name ||
          skill?.skillName ||
          'Unknown Skill',

        description:
          skill?.description ||
          `Required skill for ${role.name}.`,
      };
    }
  );

  // ======================================================
  // NORMALIZE + DEDUPLICATE TECHNOLOGIES
  // ======================================================

  const technologyMap = new Map();

  technologies.forEach(
    (technology, index) => {
      // ----------------------------------------------
      // Backend returns simple string
      // ----------------------------------------------

      if (typeof technology === 'string') {
        const technologyName =
          technology.trim();

        if (!technologyName) {
          return;
        }

        const key =
          technologyName.toLowerCase();

        if (!technologyMap.has(key)) {
          technologyMap.set(
            key,
            {
              id: technologyName,
              name: technologyName,
              skill: '',
              category: '',
            }
          );
        }

        return;
      }

      // ----------------------------------------------
      // Backend object
      // ----------------------------------------------

      const technologyName =
        technology?.technology ||
        technology?.name ||
        technology?.technologyName ||
        '';

      if (!technologyName) {
        return;
      }

      const cleanName =
        String(technologyName).trim();

      if (!cleanName) {
        return;
      }

      const key =
        cleanName.toLowerCase();

      if (!technologyMap.has(key)) {
        technologyMap.set(
          key,
          {
            ...technology,

            id:
              technology?.id ||
              cleanName ||
              `technology-${index}`,

            name: cleanName,

            skill:
              technology?.skill ||
              '',

            category:
              technology?.category ||
              '',
          }
        );
      }
    }
  );

  const normalizedTechnologies =
    Array.from(
      technologyMap.values()
    );

  // ======================================================
  // NORMALIZE PROJECTS
  // ======================================================
  //
  // IMPORTANT:
  // Backend returns:
  //
  // {
  //   project: "...",
  //   description: "...",
  //   difficulty: "...",
  //   skill: "..."
  // }
  //
  // ProjectCard expects name/title.
  // Therefore project.project must be supported.
  // ======================================================

  const normalizedProjects =
    projects.map(
      (project, index) => {
        // ----------------------------------------------
        // Backend returns a simple string
        // ----------------------------------------------

        if (typeof project === 'string') {
          return {
            id: project,
            name: project,
            title: project,
            description: '',
            difficulty: '',
            skill: '',
          };
        }

        // ----------------------------------------------
        // Backend project object
        // ----------------------------------------------

        const projectName =
          project?.project ||
          project?.name ||
          project?.title ||
          `Project ${index + 1}`;

        return {
          ...project,

          id:
            project?.id ||
            projectName ||
            `project-${index}`,

          // IMPORTANT FIX
          name: projectName,

          // IMPORTANT FIX
          title:
            project?.title ||
            projectName,

          description:
            project?.description ||
            'Project demonstrating the skills required for this role.',

          difficulty:
            project?.difficulty ||
            '',

          skill:
            project?.skill ||
            project?.matchingSkill ||
            '',
        };
      }
    );

  // ======================================================
  // NORMALIZE RELATED ROLES
  // ======================================================

  const normalizedRelatedRoles =
    relatedRoles
      .map(
        (relatedRole, index) => {
          const relatedName =
            typeof relatedRole === 'string'
              ? relatedRole
              : relatedRole?.name ||
                relatedRole?.roleName;

          if (!relatedName) {
            return null;
          }

          const matchingRole =
            allRoles.find(
              (item) =>
                item?.name?.toLowerCase() ===
                relatedName.toLowerCase()
            );

          if (matchingRole) {
            return {
              ...matchingRole,

              sharedSkillCount:
                relatedRole?.sharedSkillCount,

              sharedSkills:
                relatedRole?.sharedSkills || [],
            };
          }

          return {
            id:
              relatedRole?.id ||
              relatedName ||
              `related-role-${index}`,

            name: relatedName,

            category:
              relatedRole?.category ||
              relatedRole?.relatedRoleCategory ||
              'Related Role',

            description:
              relatedRole?.description ||
              relatedRole?.relatedRoleDescription ||
              `Explore the ${relatedName} career path.`,

            sharedSkillCount:
              relatedRole?.sharedSkillCount || 0,

            sharedSkills:
              relatedRole?.sharedSkills || [],
          };
        }
      )
      .filter(Boolean);

  // ======================================================
  // NORMALIZE LEARNING RESOURCES
  // ======================================================

  const normalizedResources =
    learningResources.map(
      (resource, index) => {
        if (
          typeof resource === 'string'
        ) {
          return {
            id: resource,
            name: resource,
            title: resource,
            url: '',
            type: '',
          };
        }

        return {
          ...resource,

          id:
            resource?.id ||
            resource?.url ||
            resource?.name ||
            resource?.title ||
            `resource-${index}`,

          name:
            resource?.name ||
            resource?.title ||
            'Learning Resource',

          title:
            resource?.title ||
            resource?.name ||
            'Learning Resource',

          url:
            resource?.url ||
            '#',

          type:
            resource?.type ||
            'Resource',
        };
      }
    );

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="space-y-10 md:space-y-12">

      {/* ==================================================
          ROLE HEADER
      ================================================== */}

      <section className="rounded-[28px] border border-slate-800 bg-slate-900/75 p-6 md:p-10">

        <div className="mb-6 inline-flex rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
          {role.category || 'Career Role'}
        </div>

        <h1 className="text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
          {role.name}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          {role.description ||
            `Explore the skills, technologies, projects, and learning resources connected to the ${role.name} role.`}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-800 pt-6 md:grid-cols-3">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Seniority Level
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {role.seniority || 'Not specified'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Required Skills
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {normalizedSkills.length}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Core Technologies
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {normalizedTechnologies.length}
            </p>
          </div>

        </div>
      </section>

      {/* ==================================================
          REQUIRED SKILLS
      ================================================== */}

      <section>

        <SectionHeader
          title="Required Skills"
          description="Core competencies needed to excel in this role"
        />

        {normalizedSkills.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {normalizedSkills.map(
              (skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                />
              )
            )}

          </div>
        ) : (
          <EmptySection
            text="No skills found for this role."
          />
        )}

      </section>

      {/* ==================================================
          TECHNOLOGIES & TOOLS
      ================================================== */}

      <section className="rounded-[28px] border border-slate-800 bg-slate-900/75 p-6 md:p-10">

        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Technologies & Tools
        </h2>

        <p className="mt-2 text-slate-400">
          Technologies commonly used with the required skills.
        </p>

        {normalizedTechnologies.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">

            {normalizedTechnologies.map(
              (technology) => (
                <TechnologyBadge
                  key={technology.id}
                  tech={technology.name}
                />
              )
            )}

          </div>
        ) : (
          <p className="mt-6 text-slate-400">
            No technologies found for this role.
          </p>
        )}

      </section>

      {/* ==================================================
          PROJECTS
      ================================================== */}

      <section>

        <SectionHeader
          title="Recommended Projects"
          description="Build portfolio pieces that demonstrate these skills"
        />

        {normalizedProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {normalizedProjects.map(
              (project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              )
            )}

          </div>
        ) : (
          <EmptySection
            text="No projects found for this role."
          />
        )}

      </section>

      {/* ==================================================
          RELATED ROLES
      ================================================== */}

      <section>

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Related Roles
          </h2>

          <p className="mt-2 text-lg text-slate-400">
            Discover similar career paths through shared skills.
          </p>

        </div>

        {normalizedRelatedRoles.length > 0 ? (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">

            {normalizedRelatedRoles.map(
              (relatedRole) => (
                <RoleCard
                  key={relatedRole.id}
                  role={relatedRole}
                />
              )
            )}

          </div>
        ) : (
          <EmptySection
            text="No related roles found."
          />
        )}

        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">

          <p className="text-sm text-indigo-200">

            <span className="font-semibold text-white">
              Related roles are discovered through shared skills.
            </span>

          </p>

        </div>

      </section>

      {/* ==================================================
          LEARNING RESOURCES
      ================================================== */}

      <section>

        <SectionHeader
          title="Learning Resources"
          description="Curated materials to build the required skills"
        />

        {normalizedResources.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {normalizedResources.map(
              (resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                />
              )
            )}

          </div>
        ) : (
          <EmptySection
            text="No learning resources found for this role."
          />
        )}

      </section>

    </div>
  );
}

// ========================================================
// EMPTY SECTION
// ========================================================

function EmptySection({ text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">

      <p className="text-slate-400">
        {text}
      </p>

    </div>
  );
}
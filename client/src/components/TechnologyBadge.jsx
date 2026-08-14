import {
  FaAws,
  FaDocker,
  FaReact,
  FaNodeJs,
  FaAngular,
  FaDatabase,
  FaCode,
  FaServer,
  FaGithub,
  FaCogs,
  FaProjectDiagram,
  FaBolt,
  FaMicrosoft,
} from 'react-icons/fa';

import { FiCpu } from 'react-icons/fi';

import { getTechBadgeColor } from '../data/sampleData';

/*
|--------------------------------------------------------------------------
| Technology Icons
|--------------------------------------------------------------------------
*/

const technologyIcons = {
  Django: FaCode,
  'Express.js': FaServer,
  'GitHub Actions': FaGithub,
  Jenkins: FaCogs,
  Redis: FaBolt,
  AWS: FaAws,
  Azure: FaMicrosoft,
  Docker: FaDocker,
  MongoDB: FaDatabase,
  PostgreSQL: FaDatabase,
  Angular: FaAngular,
  React: FaReact,
  'Vue.js': FaCode,
  Kubernetes: FaProjectDiagram,
  'Node.js': FaNodeJs,
};

/*
|--------------------------------------------------------------------------
| Technology Badge
|--------------------------------------------------------------------------
*/

export default function TechnologyBadge({
  tech,
  variant = 'default',
}) {
  const colors = getTechBadgeColor(tech);

  const Icon =
    technologyIcons[tech] || FiCpu;

  /*
  |--------------------------------------------------------------------------
  | Small Variant
  |--------------------------------------------------------------------------
  */

  if (variant === 'small') {
    return (
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          rounded
          px-2
          py-1
          text-xs
          font-medium
          ${colors}
        `}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />

        <span>{tech}</span>
      </span>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Default Variant
  |--------------------------------------------------------------------------
  */

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-md
        px-3
        py-1.5
        text-sm
        font-medium
        transition-all
        duration-200
        hover:scale-[1.02]
        ${colors}
      `}
    >
      <Icon className="h-4 w-4 shrink-0" />

      <span>{tech}</span>
    </span>
  );
}
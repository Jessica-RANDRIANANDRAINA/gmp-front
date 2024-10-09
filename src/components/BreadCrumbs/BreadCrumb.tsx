import { Link } from "react-router-dom";

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/gmp/project/list">
              Projets
            </Link>
          </li>
          <svg
            width="15"
            height="15"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-none"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z"
                className="fill-black dark:fill-white"
              ></path>
            </g>
          </svg>
          <li className="font-medium text-primaryGreen">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;

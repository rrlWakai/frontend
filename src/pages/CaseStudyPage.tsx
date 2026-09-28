import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { projects } from "../data/site";

function CaseStudyPage() {
  const { slug } = useParams();
  const location = useLocation();
  const project = projects.find((item) => item.caseStudy?.slug === slug);
  const caseStudyProjects = projects.filter((item) => item.caseStudy?.slug);
  const projectIndex = project
    ? projects.findIndex((item) => item.id === project.id)
    : -1;
  const caseStudyIndex = project
    ? caseStudyProjects.findIndex((item) => item.id === project.id)
    : -1;
  const previousProject =
    caseStudyProjects[
      (caseStudyIndex - 1 + caseStudyProjects.length) % caseStudyProjects.length
    ];
  const nextProject =
    caseStudyProjects[(caseStudyIndex + 1) % caseStudyProjects.length];
  const caseStudy = project?.caseStudy;
  const results = caseStudy?.results
    ?.filter((result) => result.value && result.label)
    .slice(0, 3);
  const galleryImages = caseStudy?.galleryImages?.filter((image) => image.src);
  const meta = [
    { label: "Role", value: caseStudy?.role },
    { label: "Client", value: caseStudy?.client },
    { label: "Year", value: caseStudy?.year },
    {
      label: "Links",
      value: caseStudy?.liveUrl || project?.url || caseStudy?.repoUrl,
    },
  ].filter((item) => item.value);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = project
      ? `${project.name} — Case Study`
      : "Project not found";
    return () => {
      document.title = previousTitle;
    };
  }, [project]);

  if (!project || !caseStudy) {
    return (
      <main className="mx-auto min-h-screen max-w-305 px-6 py-8 text-ink md:px-12">
        <Link className="border-b border-line pb-4 text-sm" to="/#projects">
          ← All work
        </Link>
        <p className="mt-10 font-serif text-3xl">Project not found</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-305 px-6 py-8 text-ink md:px-12">
      <div className="flex items-center justify-between border-b border-line pb-4 text-sm">
        <Link
          className="text-body transition-colors hover:text-ink"
          to="/#projects"
        >
          ← All work
        </Link>
        <span className="text-xs uppercase tracking-[0.12em] text-gray-light">
          Case study {String(projectIndex + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      {caseStudy.heroImage && (
        <div className="relative mt-8 aspect-16/10 overflow-hidden border border-line bg-bg-subtle md:aspect-16/7">
          <img
            className="absolute inset-0 h-full w-full object-cover object-top"
            src={caseStudy.heroImage}
            alt={`${project.name} website screenshot`}
            fetchPriority="high"
          />
          <div className="absolute inset-x-0 bottom-0 bg-paper/90 p-5 md:max-w-[75%] md:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-light">
              {project.category}
            </div>
            <h1 className="mt-2 font-serif text-[34px] font-semibold leading-tight md:text-[44px]">
              {project.name}
            </h1>
          </div>
        </div>
      )}

      {meta.length > 0 && (
        <div className="mt-8 grid grid-cols-2 border-y border-line md:grid-cols-4">
          {meta.map((item, index) => (
            <div
              className={`min-w-0 px-3 py-4 md:px-5 ${
                index % 2 === 1 ? "border-l border-line" : ""
              } ${index >= 2 ? "border-t border-line md:border-t-0" : ""} ${
                index > 0 ? "md:border-l md:border-line" : "md:border-l-0"
              }`}
              key={item.label}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-light">
                {item.label}
              </div>
              {item.label === "Links" ? (
                <div className="mt-2 flex flex-col items-start gap-1 text-sm">
                  {(caseStudy.liveUrl || project.url) && (
                    <a
                      className="border-b border-line hover:border-ink"
                      href={caseStudy.liveUrl || project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live site ↗
                    </a>
                  )}
                  {caseStudy.repoUrl && (
                    <a
                      className="border-b border-line hover:border-ink"
                      href={caseStudy.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repo ↗
                    </a>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-sm text-body">{item.value}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {caseStudy.problem && (
        <section className="grid gap-3 border-b border-line py-8 md:grid-cols-[120px_minmax(0,520px)] md:gap-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-light">
            <span className="mr-2 tabular-nums">01</span>Problem
          </h2>
          <p className="max-w-130 text-[15px] leading-7 text-body">
            {caseStudy.problem}
          </p>
        </section>
      )}

      {(caseStudy.solution ||
        caseStudy.techTags?.length ||
        galleryImages?.length) && (
        <section className="grid gap-3 border-b border-line py-8 md:grid-cols-[120px_minmax(0,520px)] md:gap-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-light">
            <span className="mr-2 tabular-nums">02</span>Solution
          </h2>
          <div className="max-w-130">
            {caseStudy.solution && (
              <p className="text-[15px] leading-7 text-body">
                {caseStudy.solution}
              </p>
            )}
            {caseStudy.techTags && caseStudy.techTags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                {caseStudy.techTags.map((tag) => (
                  <span
                    className="border-b border-line pb-1 text-xs text-gray"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {galleryImages && galleryImages.length > 0 && (
              <div className="mt-7 grid grid-cols-2 gap-3">
                {galleryImages.map((image) => (
                  <img
                    className={`w-full border border-line object-cover ${
                      image.layout === "wide"
                        ? "col-span-2 aspect-16/10"
                        : "aspect-9/16"
                    }`}
                    src={image.src}
                    alt={image.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    key={image.src}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {results && results.length > 0 && (
        <section className="grid gap-3 py-8 md:grid-cols-[120px_minmax(0,520px)] md:gap-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-light">
            <span className="mr-2 tabular-nums">03</span>Result
          </h2>
          <div className="grid grid-cols-1 divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {results.map((result) => (
              <div
                className="py-4 md:px-4 md:first:pl-0"
                key={`${result.value}-${result.label}`}
              >
                <div className="font-serif text-[32px] leading-none tabular-nums text-ink">
                  {result.value}
                </div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-light">
                  {result.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {previousProject && nextProject && caseStudyProjects.length > 1 && (
        <nav
          aria-label="Other case studies"
          className="grid grid-cols-2 divide-x divide-line border-y border-line"
        >
          <Link
            className="py-5 pr-4 transition-colors hover:text-gray"
            to={`/work/${previousProject.caseStudy?.slug}`}
            state={location.state}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-light">
              ← Previous project
            </span>
            <span className="mt-2 block font-serif text-lg">
              {previousProject.name}
            </span>
          </Link>
          <Link
            className="py-5 pl-4 text-right transition-colors hover:text-gray"
            to={`/work/${nextProject.caseStudy?.slug}`}
            state={location.state}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-light">
              Next project →
            </span>
            <span className="mt-2 block font-serif text-lg">
              {nextProject.name}
            </span>
          </Link>
        </nav>
      )}
    </main>
  );
}

export default CaseStudyPage;

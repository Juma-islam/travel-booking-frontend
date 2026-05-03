import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPackageById, fetchSimilarPackages } from "../../../services/package.service";
import { TravelPackage } from "../../../types/package";
import PackageInteractions from "@/components/features/PackageInteractions";

interface PackagePageProps {
  params: {
    id: string;
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  let travelPackage: TravelPackage;
  let relatedPackages: TravelPackage[] = [];

  try {
    travelPackage = await fetchPackageById(params.id);

    // Fetch similar packages by destination and category
    try {
      relatedPackages = await fetchSimilarPackages(
        travelPackage.destination?._id,
        travelPackage.category,
        6
      );
      // Filter out the current package
      relatedPackages = relatedPackages.filter(pkg => pkg._id !== params.id).slice(0, 4);
    } catch {
      // Silently fail - related packages are nice to have but not essential
    }
  } catch {
    return notFound();
  }

  if (!travelPackage) {
    return notFound();
  }

  const galleryImages = travelPackage.images?.length
    ? travelPackage.images
    : ["/api/placeholder/1200/700"];

  const secondaryImages = galleryImages.slice(1, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.24),transparent_35%)]">
        <div className="absolute inset-x-0 top-0 h-60 bg-linear-to-b from-slate-950 via-slate-950/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-4xl border border-slate-800 bg-slate-900/95 px-6 py-8 shadow-2xl shadow-slate-950/40 backdrop-blur-sm md:px-10 md:py-10">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
              <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Luxury travel package</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                      {travelPackage.title}
                    </h1>
                    <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
                      {travelPackage.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/explore"
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-500 hover:text-white"
                    >
                      Back to Explore
                    </Link>
                    <PackageInteractions
                      packageId={travelPackage._id}
                      packageTitle={travelPackage.title}
                      rating={travelPackage.rating}
                      numReviews={travelPackage.numReviews}
                      reviews={(travelPackage as any).reviews || []}
                      shareOnly
                    />
                    <Link
                      href={`/booking?packageId=${travelPackage._id}`}
                      className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/30 transition hover:bg-brand-500"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.45fr,0.95fr]">
                  <div className="space-y-4 rounded-4xl bg-slate-950/80 p-4 shadow-xl sm:p-6">
                    <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={galleryImages[0]}
                        alt={travelPackage.title}
                        className="h-112 w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {secondaryImages.length ? (
                        secondaryImages.map((image, index) => (
                          <div key={`${image}-${index}`} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image} alt={`${travelPackage.title} photo ${index + 2}`} className="h-44 w-full object-cover" />
                          </div>
                        ))
                      ) : (
                        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
                          More images coming soon.
                        </div>
                      )}
                    </div>
                  </div>

                  <aside className="space-y-6 rounded-4xl border border-slate-800 bg-slate-950/75 p-6 shadow-xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-900/70 p-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Destination</p>
                          <p className="mt-2 text-xl font-semibold text-white">{travelPackage.destination?.name}</p>
                        </div>
                        <span className="rounded-full bg-brand-600/15 px-3 py-1 text-sm font-semibold text-brand-200">
                          {travelPackage.category}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Price</p>
                          <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(travelPackage.price)}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Duration</p>
                          <p className="mt-3 text-3xl font-semibold text-white">{travelPackage.duration.days}d · {travelPackage.duration.nights}n</p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Rating</p>
                          <p className="mt-3 text-2xl font-semibold text-white">{travelPackage.rating?.toFixed(1)} ⭐</p>
                        </div>
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reviews</p>
                          <p className="mt-3 text-2xl font-semibold text-white">{travelPackage.numReviews || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-[1.75rem] bg-slate-900/80 p-5">
                      <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Need-to-know</p>
                      <ul className="space-y-3 text-slate-300">
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-200">1</span>
                          <div>
                            <p className="font-semibold text-white">Fast booking</p>
                            <p className="text-sm text-slate-400">Reserve your spot with one click and get instant confirmation.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-200">2</span>
                          <div>
                            <p className="font-semibold text-white">Expert support</p>
                            <p className="text-sm text-slate-400">Our travel team is ready to help you before, during, and after the trip.</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href={`/booking?packageId=${travelPackage._id}`}
                      className="block rounded-full bg-brand-500 px-5 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
                    >
                      Reserve this Experience
                    </Link>
                  </aside>
                </div>

                <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
                  <div className="space-y-6 rounded-4xl bg-slate-900/80 p-8 shadow-xl">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.32em] text-brand-300">Overview</p>
                        <h2 className="mt-3 text-3xl font-semibold text-white">What makes this package special</h2>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-950/80 p-5">
                          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">City</p>
                          <p className="mt-2 text-lg font-semibold text-white">{travelPackage.destination?.name}, {travelPackage.destination?.country}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-950/80 p-5">
                          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Category</p>
                          <p className="mt-2 text-lg font-semibold text-white">{travelPackage.category}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                        <h3 className="text-lg font-semibold text-white">Package highlights</h3>
                        <ul className="space-y-3 text-slate-300">
                          {travelPackage.inclusions.slice(0, 4).map(item => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                        <h3 className="text-lg font-semibold text-white">Travel details</h3>
                        <ul className="space-y-3 text-slate-300">
                          <li className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-brand-300">⏱</span>
                            {travelPackage.duration.days} days, {travelPackage.duration.nights} nights
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-brand-300">⭐</span>
                            Rated {travelPackage.rating?.toFixed(1)} by {travelPackage.numReviews || 0} travelers
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-brand-300">🧳</span>
                            {travelPackage.inclusions.length} included experiences
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 rounded-4xl bg-slate-950/80 p-8 shadow-xl">
                    <div>
                      <p className="text-sm uppercase tracking-[0.32em] text-brand-300">Destination story</p>
                      <h2 className="mt-3 text-3xl font-semibold text-white">Explore {travelPackage.destination?.name}</h2>
                      <p className="mt-4 text-slate-300 leading-8">{travelPackage.destination?.description || "Experience breathtaking landscapes, thoughtfully designed stays, and immersive local culture in every destination."}</p>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                      <h3 className="text-xl font-semibold text-white">What’s included</h3>
                      <ul className="mt-4 space-y-3 text-slate-300">
                        {travelPackage.inclusions.map(item => (
                          <li key={item} className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                      <h3 className="text-xl font-semibold text-white">What’s not included</h3>
                      <ul className="mt-4 space-y-3 text-slate-300">
                        {travelPackage.exclusions.map(item => (
                          <li key={item} className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-200">✕</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Reviews, Rating Breakdown & AI Summary */}
                <PackageInteractions
                  packageId={travelPackage._id}
                  packageTitle={travelPackage.title}
                  rating={travelPackage.rating}
                  numReviews={travelPackage.numReviews}
                  reviews={(travelPackage as any).reviews || []}
                />

              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedPackages.length > 0 && (
        <div className="relative overflow-hidden bg-slate-900 py-20 sm:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Continue exploring</p>
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Related experiences
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                Discover similar travel packages in {travelPackage.destination?.name} and beyond
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedPackages.map(pkg => (
                <div
                  key={pkg._id}
                  className="group rounded-3xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-lg transition hover:shadow-2xl hover:shadow-brand-500/10"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.images?.[0] || "/api/placeholder/400/300"}
                      alt={pkg.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 right-3 rounded-full bg-brand-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {pkg.category}
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition">
                        {pkg.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">{pkg.destination?.name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Starting from</p>
                        <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(pkg.price)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-900/80 px-3 py-2 text-center">
                        <p className="text-xl font-semibold text-white">{pkg.rating?.toFixed(1)}</p>
                        <p className="text-xs text-slate-400">⭐</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>⏱ {pkg.duration.days}d / {pkg.duration.nights}n</span>
                    </div>

                    <Link
                      href={`/package/${pkg._id}`}
                      className="block rounded-2xl bg-brand-600/20 px-4 py-3 text-center text-sm font-semibold text-brand-200 transition hover:bg-brand-600 hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/30 transition hover:bg-brand-500"
              >
                Explore all packages
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
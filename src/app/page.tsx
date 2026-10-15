"use client";

import { useMemo, useState } from "react";
import ActivityCard from "@/components/ActivityCard";
import ActivityForm, { type NewActivityInput } from "@/components/ActivityForm";
import ActivityDetails from "@/components/ActivityDetails";
import MapPin from "@/components/MapPin";
import { MapBackground } from "@/components/MapBackground";
import RunnerLogo from "@/components/RunnerLogo";
import { activities, sports } from "@/data/activities";
import AuthModal, { type AuthMode } from "@/components/AuthModal";
import type { Activity } from "@/types/activity";

type ActivityFilter = "all" | "mine" | "joined";

export default function Home() {
  // Tijdelijke frontendstatus; gegevens worden niet op een server opgeslagen.
  const [activityList, setActivityList] = useState<Activity[]>(activities);
  const [joinedActivityIds, setJoinedActivityIds] = useState<number[]>([]);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [mapVisible, setMapVisible] = useState(true);
  const [selectedSport, setSelectedSport] = useState("Alles");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Eindhoven");
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();
    const locationQuery = location.trim().toLowerCase();

    return activityList.filter((activity) => {
      if (activity.status === "GEANNULEERD") return false;

      const matchesOwnership =
        activityFilter === "all" ||
        (activityFilter === "mine" && activity.organizer === "Jij") ||
        (activityFilter === "joined" &&
          joinedActivityIds.includes(activity.id));

      const matchesSport =
        selectedSport === "Alles" || activity.sport === selectedSport;

      const matchesSearch =
        !query ||
        activity.title.toLowerCase().includes(query) ||
        activity.sport.toLowerCase().includes(query) ||
        activity.location.toLowerCase().includes(query);

      const matchesLocation =
        !locationQuery ||
        activity.location.toLowerCase().includes(locationQuery);

      return (
        matchesOwnership &&
        matchesSport &&
        matchesSearch &&
        matchesLocation
      );
    });
  }, [
    activityList,
    selectedSport,
    activityFilter,
    search,
    location,
    joinedActivityIds,
  ]);

  const selectedActivity = activityList.find(
    (activity) => activity.id === selectedActivityId
  );

  function joinActivity(activityId: number) {
    const activity = activityList.find((item) => item.id === activityId);

    if (
      !activity ||
      activity.organizer === "Jij" ||
      activity.participants >= activity.capacity ||
      joinedActivityIds.includes(activityId)
    ) {
      return;
    }

    setActivityList((current) =>
      current.map((item) => {
        if (item.id !== activityId) return item;

        return {
          ...item,
          participants: Math.min(item.capacity, item.participants + 1),
          memberNames: [...item.memberNames, "Jij"],
        };
      })
    );

    setJoinedActivityIds((current) => [...current, activityId]);
  }

  function leaveActivity(activityId: number) {
    if (!joinedActivityIds.includes(activityId)) return;

    setActivityList((current) =>
      current.map((item) => {
        if (item.id !== activityId) return item;

        return {
          ...item,
          participants: Math.max(0, item.participants - 1),
          memberNames: item.memberNames.filter((name) => name !== "Jij"),
        };
      })
    );

    setJoinedActivityIds((current) =>
      current.filter((id) => id !== activityId)
    );
  }

  function createActivity(input: NewActivityInput) {
    const id = Math.max(0, ...activityList.map((activity) => activity.id)) + 1;
    const startDate = new Date(`${input.date}T12:00:00`);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateKey = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    let dateLabel = startDate.toLocaleDateString("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    if (input.date === dateKey(today)) dateLabel = "Vandaag";
    else if (input.date === dateKey(tomorrow)) dateLabel = "Morgen";

    const newActivity: Activity = {
      id,
      sport: input.sport,
      title: input.title,
      location: input.location,
      time: `${dateLabel.charAt(0).toUpperCase()}${dateLabel.slice(1)}, ${input.startTime}`,
      participants: 1,
      capacity: input.capacity,
      level: input.level,
      description: input.description,
      organizer: "Jij",
      memberNames: ["Jij"],
      x: 20 + ((id * 17) % 60),
      y: 20 + ((id * 23) % 60),
    };

    setActivityList((current) => [newActivity, ...current]);
    setSelectedSport("Alles");
    setActivityFilter("all");
    setSearch("");
    setLocation("");
    setCreateModalOpen(false);
    setSelectedActivityId(id);
  }

  function resetFilters() {
    setSelectedSport("Alles");
    setActivityFilter("all");
    setSearch("");
    setLocation("");
    setSelectedActivityId(null);
  }

  function openActivity(activityId: number) {
    setSelectedActivityId(activityId);
  }

  function goBack() {
    setSelectedActivityId(null);
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-white text-gray-900">
      <header className="relative z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 md:px-8">
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-2.5"
          aria-label="Terug naar SportConnect"
        >
          <RunnerLogo />
          <span className="text-xl font-bold tracking-tight">
            Sport<span className="text-emerald-700">Connect</span>
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {currentUserName ? (
            <>
              <span className="hidden text-sm text-gray-600 sm:inline">
                Ingelogd als <strong>{currentUserName}</strong>
              </span>
              <button
                type="button"
                onClick={() => setCurrentUserName(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="hidden rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
              >
                Inloggen
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:px-4"
              >
                Registreren
              </button>
            </>
          )}
        </div>
      </header>

      {selectedActivity ? (
        <ActivityDetails
          activity={selectedActivity}
          onBack={goBack}
          hasJoined={joinedActivityIds.includes(selectedActivity.id)}
          onJoin={() => joinActivity(selectedActivity.id)}
          onLeave={() => leaveActivity(selectedActivity.id)}
          isOrganizer={selectedActivity.organizer === "Jij"}
          onCancelActivity={() => {
            setActivityList((current) =>
              current.map((item) =>
                item.id === selectedActivity.id
                  ? { ...item, status: "GEANNULEERD" }
                  : item
              )
            );
            setJoinedActivityIds((current) =>
              current.filter((id) => id !== selectedActivity.id)
            );
            setSelectedActivityId(null);
          }}
          onTransferOrganizer={(newOrganizer: string) => {
            setActivityList((current) =>
              current.map((item) =>
                item.id === selectedActivity.id
                  ? { ...item, organizer: newOrganizer }
                  : item
              )
            );
            setJoinedActivityIds((current) =>
              current.filter((id) => id !== selectedActivity.id)
            );
          }}
        />
      ) : (
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <aside
            className={`relative z-20 flex min-h-0 shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-300 ${
              mapVisible ? "w-full sm:w-[370px] lg:w-[410px]" : "w-full"
            }`}
          >
            <div className="shrink-0 border-b border-gray-100 px-5 pb-4 pt-5 md:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    Ontdek activiteiten
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Sport samen met anderen.
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                  {filteredActivities.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Activiteit aanmaken
              </button>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Zoek een sport of activiteit..."
                className="mt-5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Plaats of postcode"
                className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Activiteiten tonen
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["all", "Alles"],
                      ["mine", "Mijn activiteiten"],
                      ["joined", "Ik neem deel"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActivityFilter(value)}
                      className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                        activityFilter === value
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Sport
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
                  >
                    Wis filters
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sports.map((sport) => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => setSelectedSport(sport)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        selectedSport === sport
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-800"
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">
                  Activiteiten in de buurt
                </h2>
                <span className="text-xs text-gray-400">
                  {filteredActivities.length} resultaten
                </span>
              </div>

              {filteredActivities.length > 0 ? (
                <div
                  className={`pb-4 ${
                    mapVisible
                      ? "space-y-3"
                      : "grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {filteredActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onOpen={() => openActivity(activity.id)}
                      isJoined={joinedActivityIds.includes(activity.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Geen activiteiten gevonden
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Pas je zoekopdracht of filters aan.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Wis filters
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMapVisible((visible) => !visible)}
              aria-label={mapVisible ? "Verberg kaart" : "Toon kaart"}
              title={mapVisible ? "Verberg kaart" : "Toon kaart"}
              className="absolute right-3 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-emerald-800 shadow-lg transition hover:bg-emerald-50 sm:flex"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 transition-transform ${
                  mapVisible ? "" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="m9 18 6-6-6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </aside>

          {mapVisible && (
            <section
              className="relative hidden min-w-0 flex-1 overflow-hidden bg-[#edf1e9] sm:block"
              aria-label="Kaart met sportactiviteiten"
            >
              <MapBackground />
              <div className="absolute left-5 top-5 z-10 rounded-xl border border-gray-200/80 bg-white px-4 py-3 shadow-sm md:left-6 md:top-6">
                <p className="text-sm font-semibold">
                  Sportactiviteiten in de buurt
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {filteredActivities.length} activiteiten gevonden
                </p>
              </div>

              <div className="pointer-events-none absolute inset-0 hidden text-xs font-medium text-gray-500 lg:block">
                <span className="absolute left-[12%] top-[23%]">Strijp-S</span>
                <span className="absolute left-[48%] top-[12%]">Woensel</span>
                <span className="absolute left-[42%] top-[49%]">
                  Eindhoven Centrum
                </span>
                <span className="absolute left-[18%] top-[74%]">
                  Genneper Parken
                </span>
                <span className="absolute left-[72%] top-[75%]">Tongelre</span>
                <span className="absolute left-[67%] top-[34%]">TU/e</span>
              </div>

              {filteredActivities.map((activity) => (
                <MapPin
                  key={activity.id}
                  activity={activity}
                  selected={selectedActivityId === activity.id}
                  onClick={() => openActivity(activity.id)}
                />
              ))}
            </section>
          )}

          {!mapVisible && (
            <button
              type="button"
              onClick={() => setMapVisible(true)}
              className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-800 sm:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20Z" />
                <path d="M9 4v13.5M15 6.5V20" />
              </svg>
              Toon kaart
            </button>
          )}

          {mapVisible && (
            <button
              type="button"
              onClick={() => setMapVisible(false)}
              className="fixed bottom-5 right-5 z-50 rounded-full bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg sm:hidden"
            >
              Verberg kaart
            </button>
          )}
        </div>
      )}

      {createModalOpen && (
        <ActivityForm
          sports={sports}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={createActivity}
        />
      )}

      {authMode !== null && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={setAuthMode}
          onAuthenticated={(name) => {
            setCurrentUserName(name);
            setAuthMode(null);
          }}
        />
      )}
    </main>
  );
}
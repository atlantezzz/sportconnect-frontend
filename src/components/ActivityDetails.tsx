
import { useState } from "react";
import type { Activity } from "@/types/activity";
import { sportColors } from "@/data/activities";
import { SportIcon } from "@/components/SportIcon";
import { MapBackground } from "@/components/MapBackground";

type ActivityDetailsProps = {
  activity: Activity;
  onBack: () => void;
  hasJoined: boolean;
  onJoin: () => void;
  onLeave: () => void;
  isOrganizer: boolean;
  onCancelActivity: () => void;
  onTransferOrganizer: (newOrganizer: string) => void;
};

export default function ActivityDetails({
  activity,
  onBack,
  hasJoined,
  onJoin,
  onLeave,
  isOrganizer,
  onCancelActivity,
  onTransferOrganizer,
}: ActivityDetailsProps) {
  const isFull = activity.participants >= activity.capacity;
  const isCancelled = activity.status === "GEANNULEERD";

  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedNewOrganizer, setSelectedNewOrganizer] = useState("");
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false);

  const transferCandidates = activity.memberNames.filter(
    (name) => name !== activity.organizer && name !== "Jij"
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-emerald-800"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="m15 18-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Terug naar activiteiten
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  sportColors[activity.sport] ??
                  "bg-gray-100 text-gray-700"
                }`}
              >
                <SportIcon sport={activity.sport} className="h-7 w-7" />
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isCancelled
                    ? "bg-red-50 text-red-700"
                    : isFull
                      ? "bg-gray-100 text-gray-600"
                      : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isCancelled ? "GEANNULEERD" : isFull ? "VOL" : "OPEN"}
              </span>

              <span className="text-sm text-gray-500">
                {activity.sport}
              </span>
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {activity.title}
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-gray-600">
              {activity.description}
            </p>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-7">
              <section>
                <h2 className="text-base font-semibold text-gray-900">
                  Wanneer en waar?
                </h2>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="16"
                          rx="2"
                        />
                        <path d="M16 3v4M8 3v4M3 10h18" />
                      </svg>
                    </span>

                    <div>
                      <p className="text-sm text-gray-500">Datum en tijd</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {activity.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                    </span>

                    <div>
                      <p className="text-sm text-gray-500">Locatie</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {activity.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <SportIcon
                        sport={activity.sport}
                        className="h-5 w-5"
                      />
                    </span>

                    <div>
                      <p className="text-sm text-gray-500">Niveau</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {activity.level}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900">
                  Locatie op de kaart
                </h2>

                <div className="relative mt-3 h-48 overflow-hidden rounded-xl border border-gray-200 bg-[#edf1e9]">
                  <MapBackground />
                  <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-emerald-700 text-white shadow-lg">
                    <SportIcon
                      sport={activity.sport}
                      className="h-6 w-6"
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Illustratieve kaartweergave; echte kaart volgt later.
                </p>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-xl border border-gray-200 p-4">
                <h2 className="font-semibold text-gray-900">
                  Deelnemers
                </h2>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Aantal deelnemers
                  </span>
                  <span className="font-semibold text-gray-900">
                    {activity.participants}/{activity.capacity}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      isFull ? "bg-gray-400" : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (activity.participants / activity.capacity) * 100
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-4 divide-y divide-gray-100">
                  {activity.memberNames.map((name, index) => (
                    <div
                      key={`${activity.id}-${name}`}
                      className="flex items-center gap-3 py-3"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-800">
                        {name.charAt(0).toUpperCase()}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {name}
                        </p>
                        {name === activity.organizer && (
                          <p className="text-xs text-gray-500">
                            Organisator
                          </p>
                        )}
                      </div>

                      {index === 0 && name !== activity.organizer && (
                        <span className="ml-auto text-xs text-gray-400">
                          Deelnemer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 p-4">
                <h2 className="font-semibold text-gray-900">
                  Organisator
                </h2>

                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-base font-semibold text-white">
                    {activity.organizer.charAt(0).toUpperCase()}
                  </span>

                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.organizer}
                    </p>
                    <p className="text-sm text-gray-500">
                      Organisator van deze activiteit
                    </p>
                  </div>
                </div>
              </section>

              {isOrganizer && !isCancelled && (
                <section className="rounded-xl border border-gray-200 p-4">
                  <h2 className="font-semibold text-gray-900">
                    Activiteit beheren
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Annuleer de activiteit of draag het organisatorschap
                    over aan een bestaande deelnemer.
                  </p>

                  <div className="mt-4 grid gap-2">
                    <button
                      type="button"
                      onClick={() => setTransferOpen((open) => !open)}
                      disabled={transferCandidates.length === 0}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Organisatorschap overdragen
                    </button>

                    {transferOpen && (
                      <div className="space-y-3 rounded-lg bg-gray-50 p-3">
                        {transferCandidates.length > 0 ? (
                          <>
                            <label className="block text-sm font-medium text-gray-700">
                              Nieuwe organisator
                              <select
                                value={selectedNewOrganizer}
                                onChange={(event) =>
                                  setSelectedNewOrganizer(event.target.value)
                                }
                                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                              >
                                <option value="">Kies een deelnemer</option>
                                {transferCandidates.map((name) => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <p className="text-xs text-gray-500">
                              De overdracht gaat direct in. Je verliest
                              daarna de organisatorrol.
                            </p>

                            <button
                              type="button"
                              disabled={!selectedNewOrganizer}
                              onClick={() => {
                                if (!selectedNewOrganizer) return;
                                onTransferOrganizer(selectedNewOrganizer);
                                setTransferOpen(false);
                                setSelectedNewOrganizer("");
                              }}
                              className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Overdracht bevestigen
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Er zijn geen andere deelnemers aan wie je het
                            organisatorschap kunt overdragen.
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setCancelConfirmationOpen(true)}
                      className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Activiteit annuleren
                    </button>
                  </div>
                </section>
              )}

              {/* Deelname-interface bestaat alleen voor niet-organisatoren. */}
              {!isOrganizer && (
                <section className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  {isCancelled ? (
                    <p className="text-sm font-medium text-red-700">
                      Deelname is niet meer mogelijk.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm leading-6 text-gray-600">
                        {hasJoined
                          ? "Je bent toegevoegd aan de deelnemerslijst. Deze wijziging is tijdelijk en wordt nog niet online opgeslagen."
                          : isFull
                            ? "Deze activiteit heeft het maximale aantal deelnemers bereikt."
                            : "Er is nog plek bij deze activiteit. Je kunt je tijdelijk aanmelden om de frontend te testen."}
                      </p>

                      {hasJoined ? (
                        <div className="mt-4 space-y-2">
                          <div className="w-full rounded-lg bg-emerald-100 px-4 py-3 text-center text-sm font-semibold text-emerald-800">
                            Je doet mee
                          </div>

                          <button
                            type="button"
                            onClick={onLeave}
                            className="w-full rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                          >
                            Afmelden voor activiteit
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={onJoin}
                          disabled={isFull}
                          className={`mt-4 w-full rounded-lg px-4 py-3 text-sm font-semibold transition ${
                            isFull
                              ? "cursor-not-allowed bg-gray-200 text-gray-500"
                              : "bg-emerald-700 text-white hover:bg-emerald-800"
                          }`}
                        >
                          {isFull ? "Activiteit is vol" : "Deelnemen"}
                        </button>
                      )}
                    </>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {cancelConfirmationOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-activity-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2
              id="cancel-activity-title"
              className="text-lg font-bold text-gray-900"
            >
              Activiteit annuleren?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Weet je zeker dat je deze activiteit wilt annuleren? De
              activiteit verdwijnt uit de lijst en deelnemers kunnen zich
              niet meer aanmelden.
            </p>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCancelConfirmationOpen(false)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Terug
              </button>

              <button
                type="button"
                onClick={() => {
                  setCancelConfirmationOpen(false);
                  onCancelActivity();
                }}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Ja, activiteit annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

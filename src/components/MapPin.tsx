import type { Activity } from "@/types/activity";
import { SportIcon } from "@/components/SportIcon";

export default function MapPin({

  activity,

  selected,

  onClick,

}: {

  activity: Activity;

  selected: boolean;

  onClick: () => void;

}) {

  return (

    <button

      type="button"

      onClick={onClick}

      title={`${activity.sport}: ${activity.title}`}

      aria-label={`${activity.sport}: ${activity.title}`}

      className={`absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white shadow-md transition hover:scale-110 ${

        selected

          ? "scale-110 bg-emerald-800 text-white ring-4 ring-emerald-200"

          : "bg-white text-emerald-700 hover:bg-emerald-50"

      }`}

      style={{ left: `${activity.x}%`, top: `${activity.y}%` }}

    >

      <SportIcon sport={activity.sport} className="h-6 w-6" />

    </button>

  );

}

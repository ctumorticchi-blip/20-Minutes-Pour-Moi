import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";

const NAV_ITEMS = [
  { to: "/today", label: "Aujourd'hui", icon: "🌿" },
  { to: "/program", label: "Programme", icon: "📅" },
  { to: "/progress", label: "Progrès", icon: "📈" },
  { to: "/profile", label: "Profil", icon: "🙂" },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-warmgray-100 bg-white/95 backdrop-blur"
    >
      <ul className="mx-auto flex w-full max-w-xl items-stretch justify-around px-2 py-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "text-sage-700"
                    : "text-warmgray-500 hover:text-sage-600",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-xl",
                      isActive && "rounded-full bg-sage-100 px-2",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

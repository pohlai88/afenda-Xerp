import Link from "next/link";

import {
  AUTH_FOOTER_LINK_IDS,
  getAuthSupportLink,
} from "@/lib/auth/auth-link.registry";

export function AuthLegalLinks() {
  return (
    <nav aria-label="Legal and support" className="erp-auth-legal-links">
      <ul className="erp-auth-legal-links__list">
        {AUTH_FOOTER_LINK_IDS.map((id) => {
          const link = getAuthSupportLink(id);
          return (
            <li key={id}>
              {link.external === true ? (
                <a
                  className="erp-auth-legal-links__link"
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ) : (
                <Link className="erp-auth-legal-links__link" href={link.href}>
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

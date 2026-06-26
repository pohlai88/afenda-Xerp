/** Inline script for `.dark` on `<html>` — runs from server layout `<head>`, not a client component. */
export const docsThemeInitScript = `(function(){try{var d=document.documentElement;var s=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;if(s==="dark"||(s!=="light"&&m))d.classList.add("dark");else d.classList.remove("dark")}catch(e){}})();`;

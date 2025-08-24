// простое хранилище в localStorage
const KEY = 'uim.onboarding';

export function getOnboarding() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveOnboarding(part) {
  const cur = getOnboarding();
  const next = { ...cur, ...part };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearOnboarding() {
  localStorage.removeItem(KEY);
}

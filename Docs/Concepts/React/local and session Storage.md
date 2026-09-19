# React: localStorage & sessionStorage

## Additional React Examples

### 1. `localStorage` — Theme Preference (Persists Across Browser Sessions)

```jsx
import { useState, useEffect } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className={theme}>
      <p>Theme: {theme}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

**Why `localStorage`:** The user expects their theme choice to survive closing the browser and reopening it days later. It's a **long-lived preference** shared across all tabs.

---

### 2. `localStorage` — "Remember Me" Auth Token

```jsx
import { useState, useEffect } from "react";

function Login({ onLogin }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("authToken");
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      onLogin(token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  const handleLogin = async (remember) => {
    const res = await fetch("/api/login", { method: "POST", body: ... });
    const { token } = await res.json();
    setToken(token);
  };

  const handleLogout = () => setToken(null);

  return (
    <>
      <input type="checkbox" onChange={(e) => handleLogin(e.target.checked)} />
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
```

**Why `localStorage`:** The "remember me" checkbox means the session should persist across browser restarts. Without it, you'd use `sessionStorage` instead so the user is logged out when the tab closes.

---

### 3. `sessionStorage` — Multi-Step Form / Wizard

```jsx
import { useState, useEffect } from "react";

function CheckoutWizard() {
  const [step, setStep] = useState(() => {
    return Number(sessionStorage.getItem("checkoutStep")) || 1;
  });
  const [shipping, setShipping] = useState(() => {
    const saved = sessionStorage.getItem("shippingAddress");
    return saved ? JSON.parse(saved) : {};
  });

  // Persist current step
  useEffect(() => {
    sessionStorage.setItem("checkoutStep", step);
  }, [step]);

  // Persist form data as the user fills it in
  useEffect(() => {
    if (Object.keys(shipping).length > 0) {
      sessionStorage.setItem("shippingAddress", JSON.stringify(shipping));
    }
  }, [shipping]);

  const handleField = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (step === 1) {
    return (
      <form>
        <input name="address" onChange={handleField} value={shipping.address} />
        <input name="city" onChange={handleField} value={shipping.city} />
        <button onClick={() => setStep(2)}>Next</button>
      </form>
    );
  }

  return (
    <div>
      <p>Shipping to: {shipping.address}, {shipping.city}</p>
      <button onClick={() => setStep(1)}>Back</button>
      <button onClick={() => { sessionStorage.clear(); setStep(1); }}>Place Order</button>
    </div>
  );
}
```

**Why `sessionStorage`:** The user is mid-checkout. If they reload the page or get redirected (e.g., to a payment provider and back), their progress should survive — but they don't want a half-finished order sitting in every other tab, and they don't want it lingering after they close the tab.

---

### 4. `sessionStorage` — Per-Tab View State (Filter)

```jsx
import { useState, useEffect } from "react";

function Dashboard() {
  const [filter, setFilter] = useState(() => {
    return sessionStorage.getItem("dashboardFilter") || "7d";
  });

  useEffect(() => {
    sessionStorage.setItem("dashboardFilter", filter);
  }, [filter]);

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </select>
      <Chart range={filter} />
    </div>
  );
}
```

**Why `sessionStorage`:** A user might open two tabs to compare "7 days" vs "30 days." With `localStorage`, changing the filter in one tab would **sync** to the other — which is a bug. `sessionStorage` keeps each tab independent.

---

## Summary & Definitions

### Definitions

| | **`localStorage`** | **`sessionStorage`** |
|---|---|---|
| **Definition** | A client-side, origin-scoped key-value store that **persists indefinitely** until explicitly cleared by the user or the application. | A client-side, origin- and **tab-scoped** key-value store that is **automatically cleared** when the tab or window is closed. |
| **Lifespan** | Survives browser restarts, tab closes, everything — until deleted. | Survives reloads and in-tab navigation, but is wiped when the tab closes. |
| **Scope** | Shared across all tabs/windows of the same origin. | Isolated per tab — two tabs of the same site see **different** storage. |
| **Capacity** | ~5–10 MB (browser-dependent). | ~5 MB (browser-dependent). |
| **API** | `setItem`, `getItem`, `removeItem`, `clear` (identical to sessionStorage). | Same. |
| **Sent to server?** | No. | No. |

### When to Use Which

| Scenario | Storage | Reason |
|---|---|---|
| Theme / language preference | `localStorage` | User expects it to stick forever |
| "Remember me" auth token | `localStorage` | Session should survive browser restart |
| Caching small API responses | `localStorage` | Avoid re-fetching on next visit |
| Multi-step form / checkout progress | `sessionStorage` | Should survive reload but not linger |
| Per-tab view state (filters, sort) | `sessionStorage` | Each tab should be independent |
| OAuth redirect round-trip (PKCE state) | `sessionStorage` | Survives full-page navigation, not shared with other tabs |
| "Don't show this banner again" (per session) | `sessionStorage` | Dismissal shouldn't persist to next session |

### Rule of Thumb

> **If two tabs showing *different* values would be a bug → `localStorage`.**
> **If two tabs showing the *same* value would be a bug → `sessionStorage`.**

### The React Pattern (Same for Both)

```jsx
// 1. Lazy init: read on first render
const [value, setValue] = useState(() => {
  const saved = storage.getItem(key);
  return saved !== null ? JSON.parse(saved) : fallback;
});

// 2. Side effect: write whenever value changes
useEffect(() => {
  storage.setItem(key, JSON.stringify(value));
}, [value]);
```

The only difference between the two examples is swapping `localStorage` for `sessionStorage` — the `useEffect` pattern is identical. The choice of which storage to use is purely a **lifecycle decision**: how long should this data live, and should it be shared across tabs?   
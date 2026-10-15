
"use client";

import { useEffect, useMemo, useState } from "react";

type Transaction = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
};

const initialTransactions: Transaction[] = [
  { id: 1, name: "Monthly salary", category: "Income", amount: 4200, date: "2026-10-15" },
  { id: 2, name: "Apartment rent", category: "Housing", amount: -1250, date: "2026-10-12" },
  { id: 3, name: "Grocery shopping", category: "Food", amount: -86.5, date: "2026-10-11" },
  { id: 4, name: "Internet bill", category: "Utilities", amount: -65, date: "2026-10-09" },
];

const categories = [
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Shopping",
  "Healthcare",
  "Entertainment",
  "Other",
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const dateLabel = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Food");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lifeledger-transactions");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              item &&
              typeof item.id === "number" &&
              typeof item.name === "string" &&
              typeof item.category === "string" &&
              typeof item.amount === "number" &&
              typeof item.date === "string"
          )
        ) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
setTransactions(parsed as Transaction[]);
        }
      }
    } catch {
      // Keep the sample transactions if saved data cannot be read.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("lifeledger-transactions", JSON.stringify(transactions));
    }
  }, [transactions, loaded]);

  const income = transactions
    .filter((item) => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.max(0, (balance / income) * 100) : 0;

  const expenseCategories = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach((item) => {
      if (item.amount < 0) {
        totals[item.category] =
          (totals[item.category] || 0) + Math.abs(item.amount);
      }
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const maxCategoryExpense = Math.max(
    1,
    ...expenseCategories.map((item) => item[1])
  );

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Income" && item.amount > 0) ||
      (filter === "Expenses" && item.amount < 0);

    return matchesSearch && matchesFilter;
  });

  function addTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = Number(amount);
    if (!name.trim() || !Number.isFinite(value) || value <= 0) return;

    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const newTransaction: Transaction = {
      id: Date.now(),
      name: name.trim(),
      category: type === "income" ? "Income" : category,
      amount: type === "income" ? value : -value,
      date: localDate,
    };

    setTransactions((current) => [newTransaction, ...current]);
    setName("");
    setAmount("");
  }
  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setCurrentMonth(
    new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  );
}, []);

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white shadow-lg shadow-emerald-900/15">
              L
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">LifeLedger</h1>
              <p className="text-sm text-slate-500">
                Your money, in perspective.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Personal finance
          </div>
        </header>

        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              Your overview
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your finances, simplified.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              See what comes in, understand what goes out, and keep your
              financial life organized.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            {currentMonth}
          </p>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl bg-[#123b30] p-6 text-white shadow-lg shadow-emerald-950/10 sm:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-emerald-100">
                  Net balance
                </p>
                <p className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  {money(balance)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-xl">
                $
              </div>
            </div>
            <div className="mt-7 border-t border-white/15 pt-4">
              <p className="text-xs leading-5 text-emerald-100">
                Calculated from the transactions recorded in LifeLedger.
                This is not a connected bank balance.
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total income</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-lg text-emerald-700">
                ↙
              </span>
            </div>
            <p className="mt-5 text-2xl font-bold tracking-tight text-emerald-700">
              {money(income)}
            </p>
            <p className="mt-2 text-xs text-slate-400">Money received</p>
          </article>

          <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total expenses</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-lg text-rose-600">
                ↗
              </span>
            </div>
            <p className="mt-5 text-2xl font-bold tracking-tight text-rose-600">
              {money(expenses)}
            </p>
            <p className="mt-2 text-xs text-slate-400">Money spent</p>
          </article>
        </section>

        <section className="mb-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-900">
                Spending breakdown
              </p>
              <p className="mt-1 text-sm text-slate-500">
                See where your recorded expenses go.
              </p>
            </div>

            {expenseCategories.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                Add an expense to see your spending breakdown.
              </p>
            ) : (
              <div className="space-y-5">
                {expenseCategories.slice(0, 5).map(([label, total]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700">{label}</span>
                      <span className="font-semibold">{money(total)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{
                          width: `${Math.max(3, (total / maxCategoryExpense) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
            <p className="text-sm font-semibold text-slate-900">
              Savings snapshot
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Based on your recorded income and expenses.
            </p>
            <div className="my-6 flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[8px] border-emerald-100">
                <span className="text-xl font-bold text-emerald-800">
                  {Math.round(savingsRate)}%
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold">{money(balance)}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {balance >= 0 ? "Remaining after expenses" : "Expenses exceed income"}
                </p>
              </div>
            </div>
            <p className="rounded-2xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-900">
              This is a simple estimate from your entered records, not a
              financial recommendation.
            </p>
          </article>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.5fr]">
          <form
            onSubmit={addTransaction}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7"
          >
            <div className="mb-6">
              <p className="text-lg font-bold">Add transaction</p>
              <p className="mt-1 text-sm text-slate-500">
                Record income or an expense.
              </p>
            </div>

            <label htmlFor="type" className="mb-2 block text-sm font-medium">
              Transaction type
            </label>
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  type === "expense"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  type === "income"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Income
              </button>
            </div>
            <input id="type" type="hidden" value={type} readOnly />

            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Description
            </label>
            <input
              id="name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Grocery shopping"
              className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />

            {type === "expense" && (
              <>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Amount (USD)
            </label>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                $
              </span>
              <input
                id="amount"
                required
                min="0.01"
                max="1000000000"
                step="0.01"
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
            >
              + Add transaction
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              Stored in this browser for now
            </p>
          </form>

          <section className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5">
              <p className="text-lg font-bold">Transactions</p>
              <p className="mt-1 text-sm text-slate-500">
                Review your latest recorded activity.
              </p>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              <input
                aria-label="Search transactions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search transactions..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              />
              <select
                aria-label="Filter transactions"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option>All</option>
                <option>Income</option>
                <option>Expenses</option>
              </select>
            </div>

            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>{filteredTransactions.length} records</span>
              <span>Newest first</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredTransactions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
                        item.amount > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.amount > 0 ? "↙" : "↗"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.category} · {dateLabel(item.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-bold ${
                      item.amount > 0 ? "text-emerald-700" : "text-slate-800"
                    }`}
                  >
                    {item.amount > 0 ? "+" : "−"}
                    {money(Math.abs(item.amount))}
                  </p>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="py-12 text-center">
                  <p className="font-medium text-slate-700">
                    No transactions found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try a different search or add a transaction.
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>

        <footer className="py-8 text-center text-xs text-slate-400">
          LifeLedger · A clearer picture of your financial life
        </footer>
      </div>
    </main>
  );
}

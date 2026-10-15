
"use client";

import { useState } from "react";

const initialTransactions = [
  { id: 1, name: "Monthly salary", category: "Income", amount: 4200, date: "Oct 15" },
  { id: 2, name: "Apartment rent", category: "Housing", amount: -1250, date: "Oct 12" },
  { id: 3, name: "Grocery shopping", category: "Food", amount: -86.5, date: "Oct 11" },
  { id: 4, name: "Internet bill", category: "Utilities", amount: -65, date: "Oct 09" },
];

export default function Home() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  function addTransaction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = Number(amount);
    if (!name.trim() || !Number.isFinite(value) || value <= 0) return;

    setTransactions((current) => [
      {
        id: Date.now(),
        name: name.trim(),
        category: type === "income" ? "Income" : "Other",
        amount: type === "income" ? value : -value,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
      },
      ...current,
    ]);
    setName("");
    setAmount("");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white">
              $
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">LifeLedger</h1>
              <p className="text-sm text-slate-500">Your money, in perspective.</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            Personal finance dashboard
          </span>
        </header>

        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-slate-500">YOUR OVERVIEW</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Good morning 👋
          </h2>
          <p className="mt-2 text-slate-500">
            Here is a snapshot of your finances.
          </p>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm text-slate-300">Available balance</p>
            <p className="mt-3 text-3xl font-bold">
              ${(income - expenses).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-3 text-sm text-slate-300">Based on listed transactions</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total income</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">
              +${income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-3 text-sm text-slate-500">Money received</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total expenses</p>
            <p className="mt-3 text-3xl font-bold text-rose-600">
              -${expenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-3 text-sm text-slate-500">Money spent</p>
          </article>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[1fr_1.5fr]">
          <form
            onSubmit={addTransaction}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold">Add a transaction</h3>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              Track income or spending.
            </p>

            <label className="mb-2 block text-sm font-medium" htmlFor="type">
              Transaction type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <label className="mb-2 block text-sm font-medium" htmlFor="name">
              Description
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Electricity bill"
              className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500"
            />

            <label className="mb-2 block text-sm font-medium" htmlFor="amount">
              Amount ($)
            </label>
            <input
              id="amount"
              required
              min="0.01"
              step="0.01"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mb-5 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              + Add transaction
            </button>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Recent transactions</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest recorded activity
                </p>
              </div>
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
                {transactions.length} records
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                      transaction.amount > 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}>
                      {transaction.amount > 0 ? "↙" : "↗"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{transaction.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {transaction.category} · {transaction.date}
                      </p>
                    </div>
                  </div>
                  <p className={`shrink-0 font-semibold ${
                    transaction.amount > 0 ? "text-emerald-600" : "text-slate-900"
                  }`}>
                    {transaction.amount > 0 ? "+" : "-"}$
                    {Math.abs(transaction.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))}
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

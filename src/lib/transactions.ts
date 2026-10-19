
import { createClient } from "@/lib/supabase/client";

export type Transaction = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
};

const supabase = createClient();

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("id, name, category, amount, date")
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => ({
    id: Number(item.id),
    name: item.name,
    category: item.category,
    amount: Number(item.amount),
    date: item.date,
  }));
}

export async function createTransaction(
  transaction: Omit<Transaction, "id">
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select("id, name, category, amount, date")
    .single();

  if (error) throw error;

  return {
    id: Number(data.id),
    name: data.name,
    category: data.category,
    amount: Number(data.amount),
    date: data.date,
  };
}

export async function deleteTransaction(id: number): Promise<void> {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
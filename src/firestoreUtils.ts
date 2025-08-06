// src/firestoreUtils.ts

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  deleteField,
} from "firebase/firestore";
import { db } from "./firebase";

// Create user doc if it doesn't exist
export async function createUserIfNotExists(email: string, name: string) {
  const userRef = doc(db, "users", email);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      email,
      name,
      transactions: [],
    });
  }
}

// Get user data
export async function getUserData(email: string) {
  const userRef = doc(db, "users", email);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

// Add new transaction
export async function addTransaction(email: string, txn: any) {
  const userRef = doc(db, "users", email);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const existingTxns = docSnap.data().transactions || [];
    const updatedTxns = [...existingTxns, txn];

    await updateDoc(userRef, {
      transactions: updatedTxns,
    });

    return updatedTxns;
  }
  return [];
}

// Delete transaction
export async function deleteTransaction(email: string, txnId: string) {
  const userRef = doc(db, "users", email);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const existingTxns = docSnap.data().transactions || [];
    const updatedTxns = existingTxns.filter((txn: any) => txn.id !== txnId);

    await updateDoc(userRef, {
      transactions: updatedTxns,
    });

    return updatedTxns;
  }
  return [];
}

// Update transaction status
export async function updateTransactionStatus(email: string, txnId: string) {
  const userRef = doc(db, "users", email);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const updatedTxns = docSnap.data().transactions.map((txn: any) =>
      txn.id === txnId ? { ...txn, status: "Success" } : txn
    );

    await updateDoc(userRef, {
      transactions: updatedTxns,
    });

    return updatedTxns;
  }
  return [];
}

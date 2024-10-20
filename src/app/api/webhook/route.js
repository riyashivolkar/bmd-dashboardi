import { db } from "@/app/lib/firebase";
import {
  updateDoc,
  query,
  collection,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Webhook received:", body); // Log the incoming webhook data

    const { order } = body.data;
    const paymentStatus = order.order_status; // Payment status, e.g., PAID
    const paymentId = order.order_id; // Unique order ID from Cashfree

    // Extract clientId from Firestore based on previously stored data
    const taskQuery = query(
      collection(db, "formSubmissions"),
      where("clientId", "==", order.customer_details.customer_email) // Match with customer email or clientId as appropriate
    );
    const taskSnapshot = await getDocs(taskQuery);

    // Update the Firestore document with the payment details
    taskSnapshot.forEach(async (docRef) => {
      await updateDoc(docRef.ref, {
        paymentStatus: paymentStatus === "PAID" ? "Completed" : "Failed", // Update payment status
        orderId: paymentId, // Store order ID from Cashfree
      });
    });

    // Optionally store the payment in a 'payments' collection
    const paymentDocRef = doc(db, "payments", paymentId);
    await setDoc(
      paymentDocRef,
      {
        status: paymentStatus,
        orderId: paymentId,
        clientId: order.customer_details.customer_email, // Use client email or other unique identifier
        amount: order.order_amount,
        timestamp: new Date(),
      },
      { merge: true }
    );

    console.log("Payment saved to Firestore");
    return NextResponse.json(
      { message: "Payment recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}

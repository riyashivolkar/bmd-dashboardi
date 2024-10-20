import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // Firestore instance

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const snapshot = await getDocs(collection(db, "payments"));
        const paymentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setError("Failed to fetch payment data. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <div>Loading payments...</div>; // Loading state
  if (error) return <div>{error}</div>; // Error state

  return (
    <div>
      <h1>Payment Status</h1>
      {payments.length === 0 ? ( // Check if there are payments to display
        <p>No payment records found.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id}>
              Payment ID: {payment.id}, Status: {payment.status}, Amount: ₹
              {payment.amount}, Email: {payment.customer_email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Payment;

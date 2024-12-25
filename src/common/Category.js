"use client";
import '@/common/Category.css';
import { useEffect, useState } from 'react';
import { data } from './allData';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/app';

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ number: '', amount: '' });
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const categories = Object.keys(data);
  const router = useRouter();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedItem('');
    setShowForm(false);
  };

  const handleRadioChange = (event) => {
    setSelectedItem(event.target.value);
    setShowForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      }
    });
    return () => unSubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = "https://a.khalti.com/api/v2/epayment/initiate/";
    const headers = {
      Authorization: "key f45656457e434187a30af221d6a95837",
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      return_url: "http://localhost:3000/",
      website_url: "http://localhost:3000/",
      amount: formData.amount,
      purchase_order_id: formData.number,
      purchase_order_name: user.email,
      customer_info: {
        name: user.uid,
        email: user.email,
        phone: "9800000001", // ideally this should be dynamic
      },
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) {
        // Log HTTP error
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.payment_url) {
        // Redirect to the payment URL
        router.push(data.payment_url);
      } else {
        // Handle missing payment URL
        console.error("Payment URL not returned:", data);
        setError("An error occurred, please try again later.");
      }
    } catch (error) {
      // Log any error and show user-friendly message
      console.error("Error during payment initiation:", error);
      setError("Something went wrong with the payment. Please try again later.");
    } finally {
      // Clear form data
      setFormData({ number: '', amount: '' });
    }
  };


  return (
    <div className="container">
      <ul className="flex categories">
        {categories.map((category) => (
          <li
            key={category}
            className="flex category"
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: 'pointer' }}
          >
            <p>
              <i className={data[category].image}></i>
            </p>
            <h4>{category.replace('_', ' ')}</h4>
          </li>
        ))}
      </ul>

      {selectedCategory && (
        <div className="subcategories-radio">
          <form>
            {data[selectedCategory].items.map((item) => (
              <div key={item.link} className="radio-option">
                <input
                  type="radio"
                  id={item.link}
                  name="subcategory"
                  value={item.link}
                  checked={selectedItem === item.link}
                  onChange={handleRadioChange}
                />
                <label htmlFor={item.link}>{item.title}</label>
              </div>
            ))}
          </form>
        </div>
      )}

      {selectedItem && showForm && (
        <div className="form-container">
          <h3>
            Enter details for{' '}
            {data[selectedCategory].items.find(
              (item) => item.link === selectedItem
            )?.title}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="number">Number:</label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}

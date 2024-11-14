import React, { useState } from 'react';

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  currentWeight: number | string;
  height: number | string;
  weightGoal: number | string;
  bloodPressure?: string;
  active: number;
}

const UserRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    currentWeight: '',
    height: '',
    weightGoal: '',
    bloodPressure: '',
    active: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      currentWeight: parseFloat(formData.currentWeight as string),
    height: parseInt(formData.height as string, 10),
    weightGoal: parseFloat(formData.weightGoal as string),
      [name]: name === 'active' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        console.log(formData)
        throw new Error('Failed to register user');
        
      }

      const data = await response.json();
      console.log('User registered successfully:', data);
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show an error message)
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Prénom:</label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nom de famille:</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Mot de passe:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Votre poids (kg):</label>
        <input
          type="number"
          name="currentWeight"
          value={formData.currentWeight}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Taille (cm):</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Poids voulu (kg):</label>
        <input
          type="number"
          name="weightGoal"
          value={formData.weightGoal}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Pression sanguine:</label>
        <input
          type="text"
          name="bloodPressure"
          value={formData.bloodPressure}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Niveau activité:</label>
        <select
          name="active"
          value={formData.active}
          onChange={handleChange}
          required
        >
          <option value={1}>Low</option>
          <option value={2}>Moderate</option>
          <option value={3}>High</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default UserRegistrationForm;

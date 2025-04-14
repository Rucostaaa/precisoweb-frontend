import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../../utils/customFetch';
import { clearErrorMessage,setErrorMessage } from '../../redux/application';

const CreateToken = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [tokenLink, setTokenLink] = useState(null);

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const result= await customFetch('POST', token, form, 'auth/create-token-user');
      setTokenLink(`/solicitar-servico/user/${result.token}`);
    } catch (error) {
        console.error('Failed to create user token:', error);

        const msg = error?.response?.data?.message || 'Erro inesperado';
        const code = error?.response?.status || 500;
      
        dispatch(setErrorMessage({ code, msg }));    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Novo Usuário</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Telefone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Criar Token
          </button>
        </form>
        <ErrorMessage />


        {tokenLink && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md">
            <p className="text-green-700 font-semibold">Link criado com sucesso!</p>
            <a href={tokenLink} className="text-blue-600 underline break-words">
              {window.location.origin + tokenLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateToken;
const ErrorMessage = () => {
  const dispatch = useDispatch();
  const { code, msg } = useSelector((state) => state.application.error);

  useEffect(() => {
    if (msg) {
      const timeout = setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 4000); // auto-hide after 5s

      return () => clearTimeout(timeout);
    }
  }, [msg, dispatch]);

  if (!msg) return null;

  return (
    <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-md shadow-md">
      <p className="text-red-700 font-semibold">Erro {code}: {msg}</p>
    </div>
  );
};

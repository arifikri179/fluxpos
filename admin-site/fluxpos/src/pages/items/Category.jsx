import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("access");
  
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setCategories(response.data);
  
      } catch (error) {
        console.error("ERROR GET CATEGORIES:", error);
  
        if (error.response?.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
  
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, []);
  
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Categories</h1>

      {loading ? (
        <p className="text-slate-400">Loading data...</p>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow p-4">
          <table className="w-full border-collapse text-slate-200">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="py-3">Name</th>
                <th className="py-3">Active</th>
                <th className="py-3">Created At</th>
                <th className="py-3">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >
                  <td className="py-3">{cat.name}</td>
                  <td className="py-3">
                    {cat.is_active ? (
                      <span className="px-3 py-1 text-sm rounded-full bg-green-500/10 text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm rounded-full bg-red-500/10 text-red-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    {new Date(cat.created_at).toLocaleString()}
                  </td>
                  <td className="py-3">
                    {new Date(cat.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

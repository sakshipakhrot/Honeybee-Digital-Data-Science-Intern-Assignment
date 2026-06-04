import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Building2, MapPin, Tag, RefreshCw, Filter, Phone } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCity) queryParams.append('city', selectedCity);
      if (selectedCategory) queryParams.append('category', selectedCategory);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

      const [metricsRes, leadsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/dashboard/metrics${queryString}`),
        fetch(`http://localhost:8000/api/listings${queryString}`)
      ]);

      if (!metricsRes.ok || !leadsRes.ok) throw new Error('Failed to fetch data');

      const metricsResult = await metricsRes.json();
      const leadsResult = await leadsRes.json();

      setData(metricsResult);
      setLeads(leadsResult);

      if (!selectedCity && !selectedCategory) {
        setCityOptions(metricsResult.city_wise.map(c => c.label).sort());
        setCategoryOptions(metricsResult.category_wise.map(c => c.label).sort());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedCategory]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-indigo-500">
        <RefreshCw className="mr-2 h-6 w-6 animate-spin" /> <span className="font-medium text-slate-600">Loading insights...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-red-500 font-medium">
        Error: {error}. Check your Python backend!
      </div>
    );
  }

  const totalListings = data.city_wise.reduce((sum, item) => sum + item.count, 0);
  
  // THE NEW COLOR PALETTE (Indigo, Emerald, Amber, Rose, Violet)
  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900 md:p-10">
      <div className="mx-auto max-w-7xl">
        
        {/* --- HEADER & FILTERS --- */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Business Listings Dashboard</h1>
            <p className="text-sm font-medium text-indigo-500">Real-time aggregate reporting and leads</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition-all hover:border-indigo-300">
              <Filter className="mr-2 h-4 w-4 text-indigo-400" />
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent py-1 pl-1 pr-6 text-sm outline-none cursor-pointer text-slate-700 font-medium"
              >
                <option value="">All Cities</option>
                {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition-all hover:border-indigo-300">
              <Tag className="mr-2 h-4 w-4 text-indigo-400" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent py-1 pl-1 pr-6 text-sm outline-none cursor-pointer text-slate-700 font-medium"
              >
                <option value="">All Categories</option>
                {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <button 
              onClick={fetchDashboardData}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* --- STAT CARDS --- */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm border-t-4 border-t-indigo-500">
            <div className="flex justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Filtered Records</span>
              <div className="rounded-full bg-indigo-100 p-2"><Building2 className="h-4 w-4 text-indigo-600" /></div>
            </div>
            <div className="mt-1 text-3xl font-extrabold text-slate-800">{totalListings}</div>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm border-t-4 border-t-emerald-500">
            <div className="flex justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Visible Cities</span>
              <div className="rounded-full bg-emerald-100 p-2"><MapPin className="h-4 w-4 text-emerald-600" /></div>
            </div>
            <div className="mt-1 text-3xl font-extrabold text-slate-800">{data.city_wise.length}</div>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm border-t-4 border-t-amber-500">
            <div className="flex justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Visible Categories</span>
              <div className="rounded-full bg-amber-100 p-2"><Tag className="h-4 w-4 text-amber-600" /></div>
            </div>
            <div className="mt-1 text-3xl font-extrabold text-slate-800">{data.category_wise.length}</div>
          </div>
        </div>

        {/* --- CHARTS --- */}
        <div className="grid gap-6 mb-8 lg:grid-cols-3">
          
          {/* Chart 1: City-wise (Vertical Bar) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-700">City Distribution</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.city_wise} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs font-semibold fill-slate-400" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs font-semibold fill-slate-400" />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Category-wise (Horizontal Bar) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-700">Category Breakdown</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.category_wise} layout="vertical" margin={{ top: 10, right: 10, left: 25, bottom: 0 }}>
                  <XAxis type="number" tickLine={false} axisLine={false} className="text-xs font-semibold fill-slate-400" />
                  <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={75} className="text-xs font-semibold fill-slate-400" />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} maxBarSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Source-wise (Pie/Donut) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
            <h2 className="mb-2 text-sm font-bold text-slate-700">Source Breakdown</h2>
            <div className="flex-1 h-full w-full min-h-[16rem]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.source_wise} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="count" nameKey="label" stroke="none">
                    {data.source_wise.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" className="text-xs font-medium text-slate-600" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* --- RECENT LEADS DATA TABLE --- */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-800">Recent Leads Overview</h2>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">Showing Top 10</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Business Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{lead.business_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {lead.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{lead.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-2 text-indigo-400" />
                          {lead.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{lead.source}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-sm font-medium text-slate-500">
                      No leads found matching these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
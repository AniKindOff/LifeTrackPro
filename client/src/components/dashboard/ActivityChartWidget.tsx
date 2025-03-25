import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, TooltipProps, Legend } from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityData {
  habits: {
    daily: Array<{ date: string; count: number }>;
    categories: Array<{ name: string; count: number }>;
  };
  finances: {
    spending: Array<{ date: string; amount: number }>;
    categories: Array<{ name: string; value: number }>;
  };
}

// Define supported currencies
interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD (USD = 1)
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150.35 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.44 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.38 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.25 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 5.17 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Enhanced formatter for financial data with currency support
const formatCurrency = (value: number | string, currency: Currency): string => {
  const numValue = Number(value);
  const convertedValue = numValue * currency.rate;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(convertedValue);
};

// Custom tooltip component for financial data
const CustomTooltip = ({ active, payload, label, currency }: TooltipProps<number, string> & { currency: Currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-emerald-500 font-semibold">{formatCurrency(payload[0].value || 0, currency)}</p>
      </div>
    );
  }

  return null;
};

// Custom tooltip component for pie chart
const PieCustomTooltip = ({ active, payload, currency }: TooltipProps<number, string> & { currency: Currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-md">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-emerald-500 font-semibold">{formatCurrency(payload[0].value || 0, currency)}</p>
        <p className="text-sm text-muted-foreground">
          {((payload[0].payload.percent || 0) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }

  return null;
};

// Create a custom tooltip component for the category pie chart
const CategoryTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const { name, value, percent } = payload[0];
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-medium text-primary">{name}</p>
        <p>Amount: {formatCurrency(value, currency)}</p>
        <p>Percentage: {(percent * 100).toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

export default function ActivityChartWidget() {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [dataType, setDataType] = useState<'habits' | 'finances'>('habits');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // Default to USD
  
  const { data, isLoading, error } = useQuery<ActivityData>({
    queryKey: ['/api/user/activity'],
  });

  // Calculate total spending for finances
  const totalSpending = data?.finances?.categories?.reduce(
    (sum, category) => sum + category.value, 
    0
  ) || 0;

  // Find the largest spending category
  const largestCategory = data?.finances?.categories?.reduce(
    (max, category) => category.value > max.value ? category : max,
    { name: 'None', value: 0 }
  );

  const handleCurrencyChange = (value: string) => {
    const newCurrency = currencies.find(c => c.code === value) || currencies[0];
    setSelectedCurrency(newCurrency);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Charts</CardTitle>
          <CardDescription>Visualizing your progress</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Charts</CardTitle>
          <CardDescription>Visualizing your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Could not load activity data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Activity Charts</CardTitle>
            <CardDescription>Visualizing your progress</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {dataType === 'finances' && (
              <div className="flex items-center">
                <Select defaultValue={selectedCurrency.code} onValueChange={handleCurrencyChange}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex space-x-2">
              <button 
                onClick={() => setChartType('line')}
                className={`p-2 rounded-md ${chartType === 'line' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
              >
                <LineChartIcon size={16} />
              </button>
              <button 
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-md ${chartType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
              >
                <BarChart3 size={16} />
              </button>
              <button 
                onClick={() => setChartType('pie')}
                className={`p-2 rounded-md ${chartType === 'pie' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
              >
                <PieChartIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="habits" 
          value={dataType} 
          onValueChange={(value) => setDataType(value as 'habits' | 'finances')}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
          </TabsList>
          
          {/* Spending summary section for Finances tab */}
          {dataType === 'finances' && (
            <div className="mb-4 p-3 bg-primary/5 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spending</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalSpending, selectedCurrency)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">Largest Category</p>
                  <p className="text-lg font-semibold">
                    {largestCategory?.name || 'None'}: {formatCurrency(largestCategory?.value || 0, selectedCurrency)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <TabsContent value="habits" className="h-[300px]">
            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.habits.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Completed Habits" />
                </LineChart>
              </ResponsiveContainer>
            )}
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.habits.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Completed Habits" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {chartType === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.habits.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.habits.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          <TabsContent value="finances" className={chartType === 'pie' ? 'h-[450px]' : 'h-[300px]'}>
            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.finances.spending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `${selectedCurrency.symbol}${Math.round(value * selectedCurrency.rate)}`} 
                  />
                  <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
                  <Line type="monotone" dataKey="amount" stroke="#82ca9d" activeDot={{ r: 8 }} name="Spending" />
                </LineChart>
              </ResponsiveContainer>
            )}
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.finances.spending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `${selectedCurrency.symbol}${Math.round(value * selectedCurrency.rate)}`} 
                  />
                  <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
                  <Bar dataKey="amount" fill="#82ca9d" name="Spending">
                    {data.finances.spending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            {chartType === 'pie' && (
              <>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={data.finances.categories}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#82ca9d"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value, percent }) => 
                        `${name}: ${formatCurrency(value, selectedCurrency)} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {data.finances.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieCustomTooltip currency={selectedCurrency} />} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Category Breakdown - adjusted layout */}
                <div className="mt-4 max-h-52 overflow-y-auto">
                  <h4 className="text-sm font-medium mb-2">Spending Breakdown</h4>
                  <div className="space-y-2">
                    {data.finances.categories
                      .sort((a, b) => b.value - a.value) // Sort by highest value first
                      .map((category, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span>{category.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium">
                              {formatCurrency(category.value, selectedCurrency)}
                            </span>
                            <span className="text-muted-foreground">
                              ({((category.value / totalSpending) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
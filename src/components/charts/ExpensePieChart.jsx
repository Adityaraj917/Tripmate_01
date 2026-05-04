import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { expenseCategories } from '../../data/destinations'

const CATEGORY_COLORS = {
  transport: '#00B4D8',
  food: '#FF6B35',
  stay: '#06D6A0',
  activities: '#FFD166',
  shopping: '#EF476F',
  medical: '#8EADC1',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="glass-strong rounded-xl px-3 py-2 text-sm">
        <p className="text-light-text font-medium">{data.name}</p>
        <p className="text-primary font-semibold">₹{data.value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap gap-3 justify-center mt-4">
    {payload?.map((entry, index) => (
      <div key={index} className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-xs text-muted-text">{entry.value}</span>
      </div>
    ))}
  </div>
)

export default function ExpensePieChart({ items = [], className = '' }) {
  // Aggregate by category
  const categoryTotals = items.reduce((acc, item) => {
    const cat = item.category || 'other'
    acc[cat] = (acc[cat] || 0) + (Number(item.amount) || 0)
    return acc
  }, {})

  const data = Object.entries(categoryTotals).map(([key, value]) => {
    const catInfo = expenseCategories.find(c => c.id === key)
    return {
      name: catInfo?.name || key,
      value,
      icon: catInfo?.icon || '📦',
      color: CATEGORY_COLORS[key] || '#8EADC1'
    }
  })

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-48 text-muted-text text-sm ${className}`}>
        Add expenses to see the breakdown
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

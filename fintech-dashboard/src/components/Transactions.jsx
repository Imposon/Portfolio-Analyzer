import { motion } from 'framer-motion'

const ArrowUpRight = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m7 17 10-10m0 0v6m0-6h-6"/>
  </svg>
)

const ArrowDownRight = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m7 7 10 10m0 0v-6m0 6h-6"/>
  </svg>
)

const Clock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const CheckCircle2 = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
)

const RotateCcw = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
)

const transactions = [
  {
    id: 1,
    type: 'buy',
    asset: 'Bitcoin',
    symbol: 'BTC',
    amount: '+0.5 BTC',
    value: '+$22,615',
    time: '2 mins ago',
    status: 'completed',
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: 'sell',
    asset: 'Ethereum',
    symbol: 'ETH',
    amount: '-2.0 ETH',
    value: '-$4,380',
    time: '15 mins ago',
    status: 'completed',
    icon: CheckCircle2,
  },
  {
    id: 3,
    type: 'buy',
    asset: 'Solana',
    symbol: 'SOL',
    amount: '+50 SOL',
    value: '+$5,250',
    time: '1 hour ago',
    status: 'pending',
    icon: RotateCcw,
  },
  {
    id: 4,
    type: 'buy',
    asset: 'Cardano',
    symbol: 'ADA',
    amount: '+1000 ADA',
    value: '+$420',
    time: '3 hours ago',
    status: 'completed',
    icon: CheckCircle2,
  },
  {
    id: 5,
    type: 'sell',
    asset: 'Polkadot',
    symbol: 'DOT',
    amount: '-100 DOT',
    value: '-$680',
    time: '5 hours ago',
    status: 'completed',
    icon: CheckCircle2,
  },
]

export default function Transactions() {
  return (
    <section className="relative py-32 overflow-hidden">
      {}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Recent <span className="gradient-text">Transactions</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track all your trades and transfers in real-time
          </p>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-2 max-w-3xl mx-auto"
        >
          {}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Clock />
              <span className="font-semibold text-white">Recent Activity</span>
            </div>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              View All
            </button>
          </div>

          {}
          <div className="divide-y divide-white/5">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                className="flex items-center justify-between p-6 cursor-pointer transition-all duration-300 group rounded-xl"
              >
                <div className="flex items-center gap-4">
                  {}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tx.type === 'buy'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.type === 'buy' ? <ArrowUpRight /> : <ArrowDownRight />}
                  </div>

                  {}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{tx.asset}</span>
                      <span className="text-sm text-gray-500">{tx.symbol}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                        {tx.amount}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{tx.time}</span>
                    </div>
                  </div>
                </div>

                {}
                <div className="text-right">
                  <div className={`font-semibold ${
                    tx.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.value}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 justify-end">
                    <tx.icon className={`w-4 h-4 ${
                      tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                    }`} />
                    <span className="capitalize">{tx.status}</span>
                  </div>
                </div>

                {}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

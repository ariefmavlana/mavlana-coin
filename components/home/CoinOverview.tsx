import { fetcher } from '@/lib/coingecko.actions';
import DataTable from '@/components/DataTable';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { CoinOverviewFallback } from './fallback';

const CoinOverview = async () => {
  let coins: CoinMarketData[] = [];

  try {
    coins = await fetcher<CoinMarketData[]>('/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page: 1,
      sparkline: false,
    });
  } catch (error) {
    console.error('Error fetching coin overview:', error);
    return <CoinOverviewFallback />;
  }

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell',
      cell: (coin) => <span className="pl-4">{coin.market_cap_rank}</span>,
    },
    {
      header: 'Name',
      cellClassName: 'name-cell',
      cell: (coin) => (
        <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
          <Image src={coin.image} alt={coin.name} width={28} height={28} className="rounded-full" />
          <div className="flex flex-col">
            <span className="font-semibold">{coin.name}</span>
            <span className="text-xs text-purple-100 uppercase">{coin.symbol}</span>
          </div>
        </Link>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;
        return (
          <div className={cn('flex items-center gap-1', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
            {formatPercentage(coin.price_change_percentage_24h)}
            {isTrendingUp ? <TrendingUp width={16} height={16} /> : <TrendingDown width={16} height={16} />}
          </div>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (coin) => formatCurrency(coin.market_cap),
    },
    {
      header: 'Volume',
      cellClassName: 'volume-cell',
      cell: (coin) => formatCurrency(coin.total_volume),
    },
  ];

  return (
    <div id="coin-overview" className="custom-scrollbar">
      <div className="flex items-center justify-between p-5 pb-0">
        <h4 className="text-xl font-semibold">Market Overview</h4>
        <Link href="/coins" className="text-sm text-purple-100 hover:text-white transition-colors">
          View All
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={coins}
        rowKey={(coin) => coin.id}
        tableClassName="mt-3"
      />
    </div>
  );
};

export default CoinOverview;
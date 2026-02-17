import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Trophy, Users, TrendingUp, Medal, Crown, Award, 
  ChevronUp, ChevronDown, Minus, Calendar, RefreshCw,
  Share2, Twitter, Linkedin, Facebook, MessageCircle
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const PartnerLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [myPosition, setMyPosition] = useState(null);
  const [previousWinners, setPreviousWinners] = useState([]);
  const [featuredPartner, setFeaturedPartner] = useState(null);
  const [period, setPeriod] = useState('all_time');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const token = localStorage.getItem('dv_token');

  useEffect(() => {
    fetchLeaderboard();
    fetchPreviousWinners();
    fetchFeaturedPartner();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Fetch public leaderboard
      const leaderboardRes = await axios.get(`${API}/api/affiliates/leaderboard?period=${period}&limit=20`);
      setLeaderboard(leaderboardRes.data.leaderboard || []);
      setStats(leaderboardRes.data.stats);

      // If user is logged in, fetch their position
      if (token) {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const positionRes = await axios.get(`${API}/api/affiliates/leaderboard/my-position?period=${period}`, { headers });
          setMyPosition(positionRes.data);
        } catch (err) {
          setMyPosition(null);
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousWinners = async () => {
    try {
      const res = await axios.get(`${API}/api/affiliates/leaderboard/previous-winners?months=3`);
      setPreviousWinners(res.data.history || []);
    } catch (err) {
      console.log('No previous winners data');
    }
  };

  const fetchFeaturedPartner = async () => {
    try {
      const res = await axios.get(`${API}/api/affiliates/featured-partner`);
      setFeaturedPartner(res.data.featured_partner);
    } catch (err) {
      console.log('No featured partner');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-amber-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">#{rank}</span>;
  };

  const getRankBgClass = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/40';
    if (rank === 2) return 'bg-gradient-to-r from-slate-400/20 to-slate-300/20 border-slate-400/40';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700/20 to-amber-600/20 border-amber-700/40';
    return 'bg-slate-800/50 border-slate-700';
  };

  const periodOptions = [
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all_time', label: 'All Time' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-4"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-semibold">Partner Leaderboard</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Top Performing Partners</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Compete with other partners and climb the ranks. Top performers get special recognition and rewards!
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.total_partners}</p>
              <p className="text-sm text-slate-400">Total Partners</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.active_partners}</p>
              <p className="text-sm text-slate-400">Active Partners</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center">
              <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.total_referrals}</p>
              <p className="text-sm text-slate-400">Total Referrals</p>
            </div>
          </motion.div>
        )}

        {/* My Position Card (if logged in) */}
        {myPosition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 mb-1">Your Position</p>
                <p className="text-4xl font-bold text-white">
                  #{myPosition.your_position.rank}
                  <span className="text-lg text-slate-400 ml-2">of {myPosition.your_position.total}</span>
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Top {myPosition.your_position.percentile}% • {myPosition.your_position.referrals} referrals
                </p>
              </div>
              <div className="text-right">
                {myPosition.referrals_to_next_rank > 0 && (
                  <div className="bg-slate-900/50 rounded-xl px-4 py-3">
                    <p className="text-xs text-slate-400">To next rank</p>
                    <p className="text-lg font-bold text-amber-400">
                      +{myPosition.referrals_to_next_rank} referrals
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Neighbors */}
            {(myPosition.above_you || myPosition.below_you) && (
              <div className="mt-4 pt-4 border-t border-blue-500/20 grid grid-cols-2 gap-4">
                {myPosition.above_you && (
                  <div className="flex items-center gap-3">
                    <ChevronUp className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-slate-300">#{myPosition.above_you.rank} {myPosition.above_you.name}</p>
                      <p className="text-xs text-slate-400">{myPosition.above_you.referrals} referrals (+{myPosition.above_you.gap})</p>
                    </div>
                  </div>
                )}
                {myPosition.below_you && (
                  <div className="flex items-center gap-3">
                    <ChevronDown className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-sm text-slate-300">#{myPosition.below_you.rank} {myPosition.below_you.name}</p>
                      <p className="text-xs text-slate-400">{myPosition.below_you.referrals} referrals (-{myPosition.below_you.gap})</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Featured Partner Spotlight */}
        {featuredPartner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-amber-500/30 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Featured Partner</span>
                    <span className="text-xs text-slate-400">• {featuredPartner.featured_month}</span>
                  </div>
                  <p className="text-xl font-bold text-white">{featuredPartner.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${featuredPartner.tier_color}30`, color: featuredPartner.tier_color }}
                    >
                      {featuredPartner.tier}
                    </span>
                    <span className="text-sm text-slate-400">{featuredPartner.total_referrals} referrals</span>
                  </div>
                </div>
              </div>
              <Trophy className="w-12 h-12 text-amber-400/50" />
            </div>
          </motion.div>
        )}

        {/* Previous Month Winners */}
        {previousWinners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Previous Winners
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {previousWinners.slice(0, 3).map((monthData, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <p className="text-sm text-slate-400 mb-3">{monthData.month}</p>
                  <div className="space-y-2">
                    {monthData.winners.map((winner, widx) => (
                      <div key={widx} className="flex items-center gap-2">
                        <span className="text-lg">
                          {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{winner.name}</p>
                          <p className="text-xs text-slate-500">{winner.referrals} referrals</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Monthly Rewards Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-emerald-400" />
            Monthly Rewards
          </h3>
          <p className="text-slate-400 text-sm mb-4">Top 3 partners each month win amazing prizes!</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-xl p-4 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🥇</span>
                <span className="font-semibold text-amber-400">1st Place</span>
              </div>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• $100 bonus credits</li>
                <li>• Tier upgrade</li>
                <li>• Featured Partner spotlight</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-slate-400/10 to-slate-300/10 rounded-xl p-4 border border-slate-400/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🥈</span>
                <span className="font-semibold text-slate-300">2nd Place</span>
              </div>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• $50 bonus credits</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-700/10 to-amber-600/10 rounded-xl p-4 border border-amber-700/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🥉</span>
                <span className="font-semibold text-amber-600">3rd Place</span>
              </div>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• $25 bonus credits</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Period Filter & Refresh */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div className="flex bg-slate-800 rounded-lg p-1">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPeriod(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    period === option.value
                      ? 'bg-amber-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  data-testid={`period-${option.value}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
            data-testid="refresh-leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-800/50 text-sm font-medium text-slate-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Partner</div>
            <div className="col-span-2 text-center">Tier</div>
            <div className="col-span-2 text-center">Referrals</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          {/* Rows */}
          {leaderboard.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-l-4 ${getRankBgClass(entry.rank)}`}
                  style={{ borderLeftColor: entry.rank <= 3 ? undefined : entry.tier_color }}
                >
                  <div className="col-span-1">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="col-span-5">
                    <p className="font-semibold text-white">{entry.name}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${entry.tier_color}30`, color: entry.tier_color }}
                    >
                      {entry.tier}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-lg font-bold text-white">{entry.referrals}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-slate-400">{entry.total_referrals}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No partners with referrals yet for this period.</p>
              <p className="text-sm mt-2">Be the first to make it to the leaderboard!</p>
            </div>
          )}
        </motion.div>

        {/* CTA for non-partners */}
        {!token && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 border border-red-500/30">
              <h3 className="text-2xl font-bold mb-2">Want to join the leaderboard?</h3>
              <p className="text-slate-400 mb-6">
                Become a DataVision partner and start earning 10% commission on every referral!
              </p>
              <a
                href="/affiliate"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
              >
                Apply Now
                <TrendingUp className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PartnerLeaderboard;

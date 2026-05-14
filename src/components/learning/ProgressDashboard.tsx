import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BarChart3, Trophy, Flame, Clock, BookOpen, TrendingUp, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { LearningStats, UserBadge } from '../../types/learning';

interface ProgressDashboardProps {
  userId: string | undefined;
  onClose: () => void;
}

export default function ProgressDashboard({ userId, onClose }: ProgressDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Charger les stats
      const { data: statsData } = await supabase
        .from('learning_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsData) setStats(statsData);

      // Charger les badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', userId);

      if (badgesData) setBadges(badgesData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-3xl p-8">
          <div className="animate-spin w-12 h-12 border-4 border-iqra-gold border-t-transparent rounded-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-iqra-green to-iqra-gold p-8 text-white flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">📊 Tableau de Bord</h2>
              <p className="text-white/80 mt-2">Votre progression d'apprentissage</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Verses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <BookOpen className="text-blue-600" size={24} />
                  <span className="text-sm font-bold text-blue-600 bg-white px-3 py-1 rounded-full">
                    Versets
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  {stats?.total_verses_learned || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">Versets appris</p>
              </motion.div>

              {/* Total Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <Clock className="text-purple-600" size={24} />
                  <span className="text-sm font-bold text-purple-600 bg-white px-3 py-1 rounded-full">
                    Temps
                  </span>
                </div>
                <p className="text-3xl font-bold text-purple-700">
                  {Math.round((stats?.total_time || 0) / 60)}h
                </p>
                <p className="text-sm text-purple-600 mt-1">Temps total</p>
              </motion.div>

              {/* Streak */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <Flame className="text-orange-600" size={24} />
                  <span className="text-sm font-bold text-orange-600 bg-white px-3 py-1 rounded-full">
                    Streaks
                  </span>
                </div>
                <p className="text-3xl font-bold text-orange-700">
                  {stats?.current_streak || 0}
                </p>
                <p className="text-sm text-orange-600 mt-1">Jours consécutifs</p>
              </motion.div>

              {/* Accuracy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="text-emerald-600" size={24} />
                  <span className="text-sm font-bold text-emerald-600 bg-white px-3 py-1 rounded-full">
                    Précision
                  </span>
                </div>
                <p className="text-3xl font-bold text-emerald-700">
                  {Math.round(stats?.best_accuracy || 0)}%
                </p>
                <p className="text-sm text-emerald-600 mt-1">Meilleure précision</p>
              </motion.div>
            </div>

            {/* Badges Section */}
            <div>
              <h3 className="text-2xl font-bold text-iqra-green mb-6 flex items-center gap-2">
                <Award size={28} />
                Badges Débloqués
              </h3>

              {badges.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                  <p className="text-gray-600">
                    Commencez à apprendre pour débloquer vos premiers badges! 🎯
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {badges.map((badge, idx) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 rounded-2xl border-2 text-center bg-${badge.badges?.icon_color || 'gold'}-50 border-${badge.badges?.icon_color || 'gold'}-200`}
                    >
                      <p className="text-3xl mb-2">{badge.badges?.icon || '🏆'}</p>
                      <p className="font-bold text-sm text-gray-800">
                        {badge.badges?.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {badge.badges?.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Study Schedule */}
            {stats?.study_schedule && (
              <div>
                <h3 className="text-2xl font-bold text-iqra-green mb-4">
                  📅 Votre Calendrier
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(
                    (day, idx) => {
                      const dayKey = [
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                        'saturday',
                        'sunday'
                      ][idx] as keyof typeof stats.study_schedule;
                      const isActive = stats.study_schedule[dayKey];

                      return (
                        <motion.div
                          key={day}
                          whileHover={{ scale: 1.05 }}
                          className={`p-3 rounded-xl text-center font-bold ${
                            isActive
                              ? 'bg-iqra-gold text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day}
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-iqra-gold/10 to-iqra-green/10 rounded-2xl p-6 border border-iqra-gold/20">
              <h3 className="font-bold text-iqra-green mb-3">💡 Recommandations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Continuez vos études régulièrement pour maintenir votre streak</li>
                <li>✓ Essayez les modes de mémorisation pour améliorer votre précision</li>
                <li>✓ Relevez les quiz pour renforcer votre compréhension</li>
                <li>✓ Fixez-vous des objectifs quotidiens</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-iqra-gold text-white font-semibold rounded-xl hover:bg-iqra-gold/90 transition-all"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

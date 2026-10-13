import React, { useState, useEffect } from 'react';
import { 
  Search, 
  HelpCircle, 
  Sparkles, 
  Star, 
  Menu, 
  Plus, 
  Lightbulb, 
  ListOrdered, 
  Dumbbell, 
  Activity, 
  X, 
  Check, 
  Info,
  ChevronDown
} from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';
import { ExerciseThumbnail, IntensityBars } from '../components/dashboard/ExerciseIllustrations';
import { exerciseService } from '../services/exerciseService';

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedEquipment, setSelectedEquipment] = useState('ALL');
  const [selectedMuscle, setSelectedMuscle] = useState('ALL');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(['Push-up', 'Diamond Push-up']);

  // Filter dropdown state
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null); // 'type' | 'equipment' | 'muscles' | null

  // Custom Exercise Modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    muscleGroup: 'CHEST',
    equipment: 'NO_EQUIPMENT',
    description: '',
    defaultSets: 3,
    defaultReps: 10
  });

  // Selected exercise for detail modal
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Initial full list of exercises matching screenshots
  const [exercisesList, setExercisesList] = useState([
    {
      id: 1,
      name: 'Push-up',
      muscle: 'Chest',
      muscleEnum: 'CHEST',
      type: 'Bodyweight',
      equipment: 'No Equipment',
      equipmentEnum: 'NO_EQUIPMENT',
      intensity: 3,
      instructions: 'Place hands shoulder-width apart, keep body in a straight plank, lower chest to floor and push back up.'
    },
    {
      id: 2,
      name: 'Dumbbell Bench Press',
      muscle: 'Chest',
      muscleEnum: 'CHEST',
      type: 'Weights',
      equipment: 'Dumbbells',
      equipmentEnum: 'DUMBBELLS',
      intensity: 3,
      instructions: 'Lie flat on bench, hold dumbbells over chest, lower until elbows are at 90 degrees, press explosively upward.'
    },
    {
      id: 3,
      name: 'Diamond Push-up',
      muscle: 'Triceps',
      muscleEnum: 'TRICEPS',
      type: 'Bodyweight',
      equipment: 'No Equipment',
      equipmentEnum: 'NO_EQUIPMENT',
      intensity: 3,
      instructions: 'Form a diamond shape with thumbs and index fingers under chest, keep core braced, lower and push through triceps.'
    },
    {
      id: 4,
      name: 'Chest Dip on Bench',
      muscle: 'Triceps',
      muscleEnum: 'TRICEPS',
      type: 'Bodyweight',
      equipment: 'No Equipment',
      equipmentEnum: 'NO_EQUIPMENT',
      intensity: 3,
      instructions: 'Place hands behind you on bench edge, lower hips down until elbows reach 90 degrees, press through palms.'
    },
    {
      id: 5,
      name: 'Triceps Dip on Floor',
      muscle: 'Triceps',
      muscleEnum: 'TRICEPS',
      type: 'Bodyweight',
      equipment: 'No Equipment',
      equipmentEnum: 'NO_EQUIPMENT',
      intensity: 2,
      instructions: 'Sit on floor with hands behind hips, lift pelvis slightly, bend elbows to lower body and push upward.'
    },
    {
      id: 6,
      name: 'Bench Dip on Floor',
      muscle: 'Triceps',
      muscleEnum: 'TRICEPS',
      type: 'Bodyweight',
      equipment: 'No Equipment',
      equipmentEnum: 'NO_EQUIPMENT',
      intensity: 2,
      instructions: 'Varied angle dip utilizing bench height or floor elevation for focused triceps extension.'
    },
    {
      id: 7,
      name: 'Cable Rope Pushdown',
      muscle: 'Triceps',
      muscleEnum: 'TRICEPS',
      type: 'Machine',
      equipment: 'Full Gym',
      equipmentEnum: 'FULL_GYM',
      intensity: 3,
      instructions: 'Attach rope to high cable pulley, tuck elbows at your sides, push rope down and spread hands apart at bottom.'
    },
    {
      id: 8,
      name: 'Barbell Bench Press',
      muscle: 'Chest',
      muscleEnum: 'CHEST',
      type: 'Weights',
      equipment: 'Full Gym',
      equipmentEnum: 'FULL_GYM',
      intensity: 4,
      instructions: 'Grip barbell outside shoulder width, retract scapulae, lower bar to mid-chest, press upward smoothly.'
    },
    {
      id: 9,
      name: 'Dumbbell Squeeze Bench Press',
      muscle: 'Chest',
      muscleEnum: 'CHEST',
      type: 'Weights',
      equipment: 'Dumbbells',
      equipmentEnum: 'DUMBBELLS',
      intensity: 3,
      instructions: 'Press dumbbells together tightly in the center throughout the entire range of motion to maximize inner chest activation.'
    }
  ]);

  // Try to load any backend custom exercises
  useEffect(() => {
    exerciseService.getAllExercises()
      .then((data) => {
        if (data && data.length > 0) {
          // Merge with existing list without duplicates
          setExercisesList((prev) => {
            const existingNames = new Set(prev.map(e => e.name.toLowerCase()));
            const newItems = data
              .filter(d => !existingNames.has(d.name.toLowerCase()))
              .map(d => ({
                id: d.id,
                name: d.name,
                muscle: d.muscleGroup ? d.muscleGroup.charAt(0) + d.muscleGroup.slice(1).toLowerCase() : 'Full Body',
                muscleEnum: d.muscleGroup || 'CHEST',
                type: d.equipment === 'NO_EQUIPMENT' ? 'Bodyweight' : 'Weights',
                equipment: d.equipment ? d.equipment.replace('_', ' ') : 'No Equipment',
                equipmentEnum: d.equipment || 'NO_EQUIPMENT',
                intensity: 3,
                instructions: d.instructions || d.description || 'Perform reps with controlled tempo and strict form.'
              }));
            return [...prev, ...newItems];
          });
        }
      })
      .catch((err) => {
        console.warn('Backend exercises endpoint unreachable, using standard exercises list:', err);
      });
  }, []);

  const toggleFavorite = (name) => {
    setFavorites(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleCreateCustomExercise = async (e) => {
    e.preventDefault();
    if (!customForm.name.trim()) return;

    try {
      const saved = await exerciseService.createCustomExercise(customForm);
      const newEx = {
        id: saved.id || Date.now(),
        name: saved.name || customForm.name,
        muscle: customForm.muscleGroup.charAt(0) + customForm.muscleGroup.slice(1).toLowerCase(),
        muscleEnum: customForm.muscleGroup,
        type: customForm.equipment === 'NO_EQUIPMENT' ? 'Bodyweight' : 'Weights',
        equipment: customForm.equipment.replace('_', ' '),
        equipmentEnum: customForm.equipment,
        intensity: 3,
        instructions: customForm.description || 'Custom user created exercise.'
      };
      setExercisesList(prev => [newEx, ...prev]);
      setIsCustomModalOpen(false);
      setCustomForm({
        name: '',
        muscleGroup: 'CHEST',
        equipment: 'NO_EQUIPMENT',
        description: '',
        defaultSets: 3,
        defaultReps: 10
      });
    } catch (err) {
      // Fallback local addition if network issue
      const localEx = {
        id: Date.now(),
        name: customForm.name,
        muscle: customForm.muscleGroup.charAt(0) + customForm.muscleGroup.slice(1).toLowerCase(),
        muscleEnum: customForm.muscleGroup,
        type: customForm.equipment === 'NO_EQUIPMENT' ? 'Bodyweight' : 'Weights',
        equipment: customForm.equipment.replace('_', ' '),
        equipmentEnum: customForm.equipment,
        intensity: 3,
        instructions: customForm.description || 'Custom exercise.'
      };
      setExercisesList(prev => [localEx, ...prev]);
      setIsCustomModalOpen(false);
    }
  };

  // Filter exercises
  const filteredExercises = exercisesList.filter(ex => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchMuscle = ex.muscle.toLowerCase().includes(q);
      if (!matchName && !matchMuscle) return false;
    }
    if (selectedType !== 'ALL') {
      if (ex.type.toUpperCase() !== selectedType.toUpperCase()) return false;
    }
    if (selectedEquipment !== 'ALL') {
      if (ex.equipmentEnum !== selectedEquipment) return false;
    }
    if (selectedMuscle !== 'ALL') {
      if (ex.muscleEnum !== selectedMuscle && !ex.muscle.toUpperCase().includes(selectedMuscle)) return false;
    }
    if (favoritesOnly) {
      if (!favorites.includes(ex.name)) return false;
    }
    return true;
  });

  return (
    <UserLayout>
      <div className="space-y-4">
        
        {/* ======================================================== */}
        {/* 1. SEARCH INPUT WITH HELP, SPARKLE, STAR ICONS           */}
        {/* ======================================================== */}
        <div className="relative flex items-center bg-[#151933] rounded-2xl border border-white/10 px-3.5 py-2.5 shadow-inner">
          <Search className="w-5 h-5 text-gray-400 mr-2.5 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises"
            className="w-full bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
          />

          {/* Right Action Icons (Matching screenshot) */}
          <div className="flex items-center gap-2.5 ml-2">
            <button
              onClick={() => alert("Search for any exercise name, target muscle, or equipment type!")}
              title="Help"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Blue sparkle circle icon button */}
            <button
              onClick={() => setSearchQuery('Chest')}
              title="AI Recommend Chest"
              className="w-7 h-7 rounded-full bg-[#183466] text-[#00A3FF] border border-[#00A3FF]/40 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            {/* Star Favorite filter toggle */}
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              title={favoritesOnly ? "Showing favorites only" : "Filter favorites"}
              className={`transition-colors ${
                favoritesOnly ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-5 h-5 ${favoritesOnly ? 'fill-yellow-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. FILTER PILLS ROW (TYPE, EQUIPMENT, MUSCLES)           */}
        {/* ======================================================== */}
        <div className="grid grid-cols-3 gap-2 relative">
          
          {/* Filter 1: Type */}
          <button
            onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'type' ? null : 'type')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-semibold transition-all ${
              selectedType !== 'ALL' || activeFilterDropdown === 'type'
                ? 'bg-[#18234D] border-[#00A3FF] text-[#00A3FF]'
                : 'bg-[#151933] border-white/10 text-gray-300 hover:border-white/20'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="truncate">{selectedType === 'ALL' ? 'Type' : selectedType}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Filter 2: Equipment */}
          <button
            onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'equipment' ? null : 'equipment')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-semibold transition-all ${
              selectedEquipment !== 'ALL' || activeFilterDropdown === 'equipment'
                ? 'bg-[#18234D] border-[#00A3FF] text-[#00A3FF]'
                : 'bg-[#151933] border-white/10 text-gray-300 hover:border-white/20'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span className="truncate">
              {selectedEquipment === 'ALL' ? 'Equipment' : selectedEquipment.replace('_', ' ')}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Filter 3: Muscles */}
          <button
            onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'muscles' ? null : 'muscles')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-semibold transition-all ${
              selectedMuscle !== 'ALL' || activeFilterDropdown === 'muscles'
                ? 'bg-[#18234D] border-[#00A3FF] text-[#00A3FF]'
                : 'bg-[#151933] border-white/10 text-gray-300 hover:border-white/20'
            }`}
          >
            <span className="text-base leading-none">💪</span>
            <span className="truncate">{selectedMuscle === 'ALL' ? 'Muscles' : selectedMuscle}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* DROPDOWN MENU FOR ACTIVE FILTER */}
        {activeFilterDropdown && (
          <div className="bg-[#181E3B] border border-white/10 rounded-2xl p-3 shadow-2xl animate-in fade-in duration-150">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Filter by {activeFilterDropdown}
              </span>
              <button
                onClick={() => setActiveFilterDropdown(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type Options */}
            {activeFilterDropdown === 'type' && (
              <div className="flex flex-wrap gap-2">
                {['ALL', 'Bodyweight', 'Weights', 'Machine'].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setSelectedType(t); setActiveFilterDropdown(null); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedType === t ? 'bg-[#0088FF] text-white' : 'bg-[#0E1225] text-gray-300 hover:bg-[#151A33]'
                    }`}
                  >
                    {t === 'ALL' ? 'All Types' : t}
                  </button>
                ))}
              </div>
            )}

            {/* Equipment Options */}
            {activeFilterDropdown === 'equipment' && (
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All Equipment', val: 'ALL' },
                  { label: 'No Equipment', val: 'NO_EQUIPMENT' },
                  { label: 'Dumbbells', val: 'DUMBBELLS' },
                  { label: 'Full Gym', val: 'FULL_GYM' }
                ].map((eq) => (
                  <button
                    key={eq.val}
                    onClick={() => { setSelectedEquipment(eq.val); setActiveFilterDropdown(null); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedEquipment === eq.val ? 'bg-[#0088FF] text-white' : 'bg-[#0E1225] text-gray-300 hover:bg-[#151A33]'
                    }`}
                  >
                    {eq.label}
                  </button>
                ))}
              </div>
            )}

            {/* Muscle Options */}
            {activeFilterDropdown === 'muscles' && (
              <div className="flex flex-wrap gap-2">
                {['ALL', 'CHEST', 'TRICEPS', 'BICEPS', 'LATS', 'QUADS', 'ABS'].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMuscle(m); setActiveFilterDropdown(null); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedMuscle === m ? 'bg-[#0088FF] text-white' : 'bg-[#0E1225] text-gray-300 hover:bg-[#151A33]'
                    }`}
                  >
                    {m === 'ALL' ? 'All Muscles' : m}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. EXERCISE DIRECTORY HEADING: All Exercises / +Custom   */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Menu className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">All Exercises</h2>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Custom Exercise</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 4. EXERCISE CARDS LIST                                   */}
        {/* ======================================================== */}
        <div className="space-y-3 pb-8">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 bg-[#12162B] rounded-2xl border border-white/5">
              <p className="text-sm text-gray-400">No exercises found matching your filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('ALL');
                  setSelectedEquipment('ALL');
                  setSelectedMuscle('ALL');
                  setFavoritesOnly(false);
                }}
                className="mt-3 text-xs text-blue-400 font-bold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredExercises.map((exercise) => {
              const isFav = favorites.includes(exercise.name);

              return (
                <div
                  key={exercise.id}
                  className="bg-[#101429] hover:bg-[#151A36] border border-white/5 rounded-2xl p-3 flex items-center justify-between transition-colors shadow-md group cursor-pointer"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3.5">
                    {/* Exercise Thumbnail */}
                    <ExerciseThumbnail name={exercise.name} className="w-14 h-14" />

                    <div>
                      {/* Top icons: Intensity bars + Bulb + List icons matching screenshot */}
                      <div className="flex items-center gap-2.5 mb-1">
                        <IntensityBars count={exercise.intensity || 3} />
                        <Lightbulb className="w-3.5 h-3.5 text-[#00A3FF]" />
                        <ListOrdered className="w-3.5 h-3.5 text-[#00A3FF]" />
                      </div>

                      {/* Exercise Name */}
                      <h3 className="text-sm font-extrabold text-white group-hover:text-blue-300 transition-colors">
                        {exercise.name}
                      </h3>

                      {/* Muscle Group */}
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {exercise.muscle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Star Outline Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(exercise.name);
                    }}
                    title={isFav ? "Remove favorite" : "Add to favorites"}
                    className="p-2 text-gray-400 hover:text-yellow-400 transition-colors rounded-full hover:bg-white/5"
                  >
                    <Star className={`w-5 h-5 ${isFav ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* EXERCISE DETAIL MODAL */}
        {selectedExercise && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#12162B] border border-blue-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 bg-[#181E3B] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ExerciseThumbnail name={selectedExercise.name} className="w-12 h-12" />
                  <div>
                    <h3 className="text-base font-black text-white">{selectedExercise.name}</h3>
                    <p className="text-xs text-blue-400 font-semibold">{selectedExercise.muscle} • {selectedExercise.equipment}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Execution & Form</h4>
                  <p className="text-xs text-gray-200 leading-relaxed bg-[#0A0D1D] p-3 rounded-xl border border-white/5">
                    {selectedExercise.instructions}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#181E3B] p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[10px] uppercase">Equipment</span>
                    <span className="font-bold text-white mt-0.5 block">{selectedExercise.equipment}</span>
                  </div>
                  <div className="bg-[#181E3B] p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block text-[10px] uppercase">Recommended Sets</span>
                    <span className="font-bold text-[#00A3FF] mt-0.5 block">3 sets x 10 reps</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM EXERCISE CREATION MODAL */}
        {isCustomModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#12162B] border border-blue-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 bg-[#181E3B] border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">+ Custom Exercise</h3>
                  <p className="text-xs text-gray-400">Add an exercise to your workout library</p>
                </div>
                <button
                  onClick={() => setIsCustomModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomExercise} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    placeholder="e.g. Incline Push-up"
                    className="w-full bg-[#0A0D1D] text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Muscle Group
                    </label>
                    <select
                      value={customForm.muscleGroup}
                      onChange={(e) => setCustomForm({ ...customForm, muscleGroup: e.target.value })}
                      className="w-full bg-[#0A0D1D] text-white px-3 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none text-xs"
                    >
                      <option value="CHEST">Chest</option>
                      <option value="TRICEPS">Triceps</option>
                      <option value="BICEPS">Biceps</option>
                      <option value="LATS">Lats</option>
                      <option value="QUADS">Quads</option>
                      <option value="ABS">Abs</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Equipment
                    </label>
                    <select
                      value={customForm.equipment}
                      onChange={(e) => setCustomForm({ ...customForm, equipment: e.target.value })}
                      className="w-full bg-[#0A0D1D] text-white px-3 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none text-xs"
                    >
                      <option value="NO_EQUIPMENT">No Equipment</option>
                      <option value="DUMBBELLS">Dumbbells</option>
                      <option value="FULL_GYM">Full Gym</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Description / Form Notes
                  </label>
                  <textarea
                    rows={2}
                    value={customForm.description}
                    onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                    placeholder="Instructions, cues, tempo..."
                    className="w-full bg-[#0A0D1D] text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none text-xs resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(false)}
                    className="flex-1 bg-[#181E3B] text-gray-300 font-bold py-2.5 rounded-xl text-xs hover:bg-[#20274C]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg"
                  >
                    Save Exercise
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  );
}

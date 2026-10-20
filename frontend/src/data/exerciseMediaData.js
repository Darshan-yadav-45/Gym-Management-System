/**
 * FitFlow Central Exercise Media & Biomechanics Database
 * 
 * Reusable data structure storing real human exercise visual demonstrations:
 * - High-definition real human photos (start posture and peak contraction)
 * - Video & real human animation assets
 * - Comprehensive biomechanical guidance (setup, step-by-step, breathing, mistakes, safety, tempo)
 * - Exercise-name lookup helper `getExerciseMedia(name)`
 */

export const EXERCISE_MEDIA_MAP = {
  pushup: {
    id: 'pushup',
    name: 'Push-up',
    aliases: ['push-up', 'pushups', 'push up', 'standard push-up'],
    muscle: 'Chest',
    targetEnum: 'chest',
    secondaryMuscles: 'Triceps Brachii, Anterior Deltoids, Core, Serratus Anterior',
    difficulty: 'Intermediate',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/pushup_0.jpg',
    poster: '/exercises/images/pushup_0.jpg',
    startPhoto: '/exercises/images/pushup_0.jpg',
    peakPhoto: '/exercises/images/pushup_1.jpg',
    animationUrl: '/exercises/pushup_ani.gif',
    videoUrl: null,
    setup: 'Start in a straight-arm plank position with hands slightly wider than shoulder-width, fingers spread, core braced, and body forming an unbroken rigid line from crown of head to heels.',
    steps: [
      'Assume a solid high plank with wrists stacked under shoulders and neck neutral.',
      'Engage your abdominal wall and glutes firmly to prevent anterior pelvic tilt or lumbar hyperextension.',
      'Inhale as you lower your body in one rigid plane until your chest is ~2–3 inches from the ground, keeping elbows angled back at approximately 45 degrees.',
      'Pause for a split-second at the lowest position with full chest stretch.',
      'Exhale forcefully and drive through the palms to return to full arm lockout at the starting position.'
    ],
    breathing: 'Inhale smoothly during the descent; exhale forcefully on the upward drive.',
    mistakes: [
      'Sagging hips or hyperextending the lower back (indicates lost core brace)',
      'Flaring elbows out at 90 degrees, which places excessive stress on rotator cuffs',
      'Craning the neck toward the floor to mimic depth',
      'Incomplete depth or bouncing out of the bottom position'
    ],
    setsReps: '3–4 sets × 10–15 reps',
    restSeconds: 60,
    tempo: '2-0-1-0 (2s eccentric, 1s concentric)',
    safety: 'Maintain neutral cervical spine alignment by gazing slightly forward on the floor. If wrist discomfort occurs, use neutral-grip push-up handles.',
    regression: 'Incline Push-up (hands on elevated surface) or Knee Push-up',
    progression: 'Diamond Push-up or Feet-Elevated Decline Push-up'
  },

  diamond_pushup: {
    id: 'diamond_pushup',
    name: 'Diamond Push-up',
    aliases: ['diamond push-up', 'diamond pushup', 'close-grip pushup', 'triangle pushup'],
    muscle: 'Triceps',
    targetEnum: 'triceps',
    secondaryMuscles: 'Inner Pectoralis Major, Anterior Deltoids, Core',
    difficulty: 'Intermediate',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/diamond_pushup_0.jpg',
    poster: '/exercises/images/diamond_pushup_0.jpg',
    startPhoto: '/exercises/images/diamond_pushup_0.jpg',
    peakPhoto: '/exercises/images/diamond_pushup_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Place your thumbs and index fingers touching together directly beneath your mid-sternum to form a diamond or triangle shape in a rigid plank.',
    steps: [
      'Brace core and lock quadriceps to prevent hips from piking or sagging.',
      'Inhale and lower your chest under control toward the center of your diamond.',
      'Keep elbows tracking back tightly alongside your ribcage rather than flaring out.',
      'Stop when your chest lightly touches or hovers an inch above your hands.',
      'Exhale and push explosively through your palms, squeezing triceps at full arm extension.'
    ],
    breathing: 'Inhale while lowering toward the diamond; exhale while extending elbows.',
    mistakes: [
      'Allowing elbows to flare outward wide, transferring load off the triceps onto joints',
      'Piking the hips into the air (cheating the bodyweight load)',
      'Placing hands too far forward ahead of the chest line'
    ],
    setsReps: '3 sets × 8–12 reps',
    restSeconds: 60,
    tempo: '2-1-1-0',
    safety: 'Keep wrists straight and grounded. If wrists feel strained, widen the hand gap slightly into a close-grip position.',
    regression: 'Kneeling Diamond Push-up or Elevated Hands Diamond Push-up',
    progression: 'Deficit Diamond Push-up or Weighted Diamond Push-up'
  },

  bench_dip: {
    id: 'bench_dip',
    name: 'Chest Dip on Bench',
    aliases: ['chest dip on bench', 'bench dip', 'bench dips', 'tricep dips on bench'],
    muscle: 'Triceps',
    targetEnum: 'triceps',
    secondaryMuscles: 'Anterior Deltoids, Lower Pectoralis Major',
    difficulty: 'Intermediate',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/bench_dip_0.jpg',
    poster: '/exercises/images/bench_dip_0.jpg',
    startPhoto: '/exercises/images/bench_dip_0.jpg',
    peakPhoto: '/exercises/images/bench_dip_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Sit on a sturdy gym bench or elevated flat surface. Grip the front edge shoulder-width apart, fingers facing forward, hips slightly forward off the bench.',
    steps: [
      'Keep shoulders depressed and pulled back away from your ears.',
      'Inhale and lower hips vertically down by bending your elbows to approximately 90 degrees.',
      'Ensure your back stays close to the bench edge throughout the descent.',
      'Exhale and drive through the heels of your palms until your arms are fully straightened.'
    ],
    breathing: 'Inhale on the downward descent; exhale pressing back to top.',
    mistakes: [
      'Drifting hips too far forward away from the bench (strains front shoulders)',
      'Shrugging shoulders up toward the ears (lost scapular depression)',
      'Dropping below 90 degrees elbow bend, stressing anterior joint capsules'
    ],
    setsReps: '3 sets × 10–12 reps',
    restSeconds: 60,
    tempo: '2-0-1-0',
    safety: 'Keep torso upright and hips close to the bench to keep shoulder joints in safe scapular plane.',
    regression: 'Bench Dip with knees bent at 90 degrees and feet flat on floor',
    progression: 'Bench Dip with feet elevated on a second bench or weighted lap plate'
  },

  triceps_dip_floor: {
    id: 'triceps_dip_floor',
    name: 'Triceps Dip on Floor',
    aliases: ['triceps dip on floor', 'floor dips', 'floor dip', 'seated triceps dip'],
    muscle: 'Triceps',
    targetEnum: 'triceps',
    secondaryMuscles: 'Anterior Deltoids, Core',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/triceps_dip_floor_0.jpg',
    poster: '/exercises/images/triceps_dip_floor_0.jpg',
    startPhoto: '/exercises/images/triceps_dip_floor_0.jpg',
    peakPhoto: '/exercises/images/triceps_dip_floor_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Sit on the floor with knees bent and feet flat on the ground. Place hands behind hips, fingers pointing forward toward your feet. Elevate your pelvis slightly off the mat.',
    steps: [
      'Lift hips slightly off the floor so weight rests on hands and feet.',
      'Bend elbows directly backward to lower your glutes toward the floor without resting on it.',
      'Keep shoulders packed and chest proud.',
      'Push through palms to extend arms and contract triceps firmly at the top.'
    ],
    breathing: 'Inhale lowering; exhale pressing up.',
    mistakes: [
      'Using hip thrusting rather than elbow flexion and extension to move',
      'Pointing fingers backward or outward instead of forward'
    ],
    setsReps: '3 sets × 12–15 reps',
    restSeconds: 45,
    tempo: '2-1-1-0',
    safety: 'Ideal for beginners and home workouts; keeps shoulder joint stress minimal.',
    regression: 'Seated pulse with smaller range of motion',
    progression: 'Elevate one leg off the floor or progress to Bench Dips'
  },

  bench_dip_floor: {
    id: 'bench_dip_floor',
    name: 'Bench Dip on Floor',
    aliases: ['bench dip on floor', 'elevated floor dip'],
    muscle: 'Triceps',
    targetEnum: 'triceps',
    secondaryMuscles: 'Anterior Deltoids, Lower Pectorals',
    difficulty: 'Intermediate',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/bench_dip_0.jpg',
    poster: '/exercises/images/bench_dip_0.jpg',
    startPhoto: '/exercises/images/bench_dip_0.jpg',
    peakPhoto: '/exercises/images/bench_dip_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Position hands on a low elevated riser, step, or bench with feet grounded on the floor.',
    steps: [
      'Extend legs forward with knees slightly bent or straight.',
      'Lower torso smoothly by bending elbows to 90 degrees.',
      'Extend arms firmly through triceps lockout.'
    ],
    breathing: 'Inhale on descent; exhale on ascent.',
    mistakes: ['Allowing elbows to wing out laterally'],
    setsReps: '3 sets × 10 reps',
    restSeconds: 60,
    tempo: '2-0-1-0',
    safety: 'Keep scapulae retracted and avoid shoulder collapse.',
    regression: 'Floor dip',
    progression: 'Feet-elevated bench dip'
  },

  dumbbell_bench_press: {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Bench Press',
    aliases: ['dumbbell bench press', 'db bench press', 'dumbbell chest press'],
    muscle: 'Chest',
    targetEnum: 'chest',
    secondaryMuscles: 'Anterior Deltoids, Triceps Brachii',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells',
    type: 'Weights',
    thumbnail: '/exercises/images/db_bench_0.jpg',
    poster: '/exercises/images/db_bench_0.jpg',
    startPhoto: '/exercises/images/db_bench_0.jpg',
    peakPhoto: '/exercises/images/db_bench_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Lie flat on bench with feet planted firmly into the floor. Hold dumbbells vertically over chest with wrists neutral and elbows angled 45–60 degrees.',
    steps: [
      'Retract and pin shoulder blades firmly into the bench pad.',
      'Lower dumbbells slowly along the outside of your chest, feeling a deep pec stretch.',
      'Keep wrists stacked directly over elbows at the bottom of the movement.',
      'Press dumbbells upward in a slight converging arc, squeezing pectorals at the peak without clanking weights.'
    ],
    breathing: 'Inhale deeply as dumbbells lower; exhale past the sticking point on the press.',
    mistakes: [
      'Allowing elbows to flare straight out at 90 degrees',
      'Bouncing or losing wrist control at the bottom',
      'Lifting feet or glutes off the bench'
    ],
    setsReps: '3–4 sets × 8–10 reps',
    restSeconds: 75,
    tempo: '2-1-1-0',
    safety: 'Use manageable dumbbells to protect shoulder joints and maintain strict bar path.',
    regression: 'Dumbbell Floor Press',
    progression: 'Incline Dumbbell Bench Press or Pause Dumbbell Press'
  },

  barbell_bench_press: {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    aliases: ['barbell bench press', 'flat bench press', 'bench press', 'barbell chest press'],
    muscle: 'Chest',
    targetEnum: 'chest',
    secondaryMuscles: 'Anterior Deltoids, Triceps Brachii, Serratus',
    difficulty: 'Intermediate',
    equipment: 'Full Gym',
    type: 'Weights',
    thumbnail: '/exercises/images/bb_bench_0.jpg',
    poster: '/exercises/images/bb_bench_0.jpg',
    startPhoto: '/exercises/images/bb_bench_0.jpg',
    peakPhoto: '/exercises/images/bb_bench_1.jpg',
    animationUrl: null,
    videoUrl: '/exercises/videos/bench_press.webm',
    setup: 'Lie on flat bench under rack with eyes aligned beneath bar. Plant feet flat, arch thoracic spine slightly, retract scapulae, grip bar just outside shoulder-width.',
    steps: [
      'Unrack bar with straight arms and settle it directly over mid-chest.',
      'Inhale, pull shoulder blades tight together, and lower bar under 2-3s control to touch mid-sternum.',
      'Ensure forearms remain perpendicular to the floor.',
      'Drive feet into floor and press bar explosively upward and slightly back toward eye line to lockout.'
    ],
    breathing: 'Deep diaphragmatic inhale before descent, hold brace through turnaround, exhale through lockout.',
    mistakes: [
      'Bouncing barbell violently off the sternum',
      'Flaring elbows outward excessively',
      'Hips lifting off the bench during the press'
    ],
    setsReps: '3–4 sets × 6–10 reps',
    restSeconds: 90,
    tempo: '3-0-1-0',
    safety: 'Always secure collars on bar and use safety spotters or pins when training heavy.',
    regression: 'Dumbbell Bench Press or Push-ups',
    progression: 'Pause Bench Press or Close-Grip Bench Press'
  },

  dumbbell_squeeze_press: {
    id: 'dumbbell_squeeze_press',
    name: 'Dumbbell Squeeze Bench Press',
    aliases: ['dumbbell squeeze bench press', 'squeeze press', 'hex press'],
    muscle: 'Chest',
    targetEnum: 'chest',
    secondaryMuscles: 'Inner Pectorals, Anterior Deltoids, Triceps',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells',
    type: 'Weights',
    thumbnail: '/exercises/images/db_bench_0.jpg',
    poster: '/exercises/images/db_bench_0.jpg',
    startPhoto: '/exercises/images/db_bench_0.jpg',
    peakPhoto: '/exercises/images/db_bench_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Lie on flat bench holding dumbbells with neutral palms, pressing the dumbbell heads tightly together over center of chest.',
    steps: [
      'Press dumbbells into each other continuously with maximum inward isometric force.',
      'Lower dumbbells slowly toward lower sternum while sustaining intense inward pressure.',
      'Press upward to arm extension without separating the weights at any point.'
    ],
    breathing: 'Inhale lowering; exhale pressing while maintaining inward squeeze.',
    mistakes: ['Allowing dumbbells to separate apart', 'Rushing tempo'],
    setsReps: '3 sets × 10–12 reps',
    restSeconds: 60,
    tempo: '2-1-1-0',
    safety: 'Focus on muscular tension rather than ultra-heavy loading.',
    regression: 'Standard Dumbbell Bench Press',
    progression: 'Incline Dumbbell Squeeze Press'
  },

  cable_rope_pushdown: {
    id: 'cable_rope_pushdown',
    name: 'Cable Rope Pushdown',
    aliases: ['cable rope pushdown', 'rope pushdown', 'triceps pushdown', 'cable tricep extension'],
    muscle: 'Triceps',
    targetEnum: 'triceps',
    secondaryMuscles: 'Forearms, Core Stabilizers',
    difficulty: 'Intermediate',
    equipment: 'Full Gym',
    type: 'Machine',
    thumbnail: '/exercises/images/cable_pushdown_0.jpg',
    poster: '/exercises/images/cable_pushdown_0.jpg',
    startPhoto: '/exercises/images/cable_pushdown_0.jpg',
    peakPhoto: '/exercises/images/cable_pushdown_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Attach rope to high cable pulley. Stand with feet hip-width, hinge slightly at hips, pin elbows against ribs, grasp rope near bottom knurls.',
    steps: [
      'Pin upper arms stationary against torso.',
      'Extend elbows downward, driving rope toward floor.',
      'At the bottom of extension, spread rope handles apart laterally with thumbs pointing down.',
      'Squeeze triceps for 1 full second at peak extension.',
      'Control cable upward until forearms reach slightly above parallel.'
    ],
    breathing: 'Exhale pushing down; inhale returning with control.',
    mistakes: [
      'Swinging torso back and forth to generate momentum',
      'Allowing elbows to drift forward and backward instead of staying pinned',
      'Failing to spread rope ends apart at contraction'
    ],
    setsReps: '3 sets × 12–15 reps',
    restSeconds: 60,
    tempo: '2-0-1-1',
    safety: 'Keep spine neutral with engaged core to avoid lower back strain.',
    regression: 'Band Pushdown or Single-arm Cable Pushdown',
    progression: 'Heavy Straight-Bar Pushdown or Overhead Cable Extension'
  },

  squat: {
    id: 'squat',
    name: 'Bodyweight Squat',
    aliases: ['bodyweight squat', 'air squat', 'squats', 'squat'],
    muscle: 'Quads',
    targetEnum: 'quads',
    secondaryMuscles: 'Gluteus Maximus, Hamstrings, Core, Calves',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/squat_0.jpg',
    poster: '/exercises/images/squat_0.jpg',
    startPhoto: '/exercises/images/squat_0.jpg',
    peakPhoto: '/exercises/images/squat_1.jpg',
    animationUrl: null,
    videoUrl: '/exercises/videos/squat.webm',
    setup: 'Stand with feet shoulder-width apart, toes turned outward 15–25 degrees. Keep chest proud, shoulders back, and hands clasped at chest or extended forward.',
    steps: [
      'Initiate movement by hinging hips back while bending knees simultaneously.',
      'Track knees in the exact direction of your toes.',
      'Lower torso until thighs reach parallel with the ground or slightly below.',
      'Keep heels glued to the floor and torso upright.',
      'Drive through mid-foot and heels to stand back up to full hip and knee extension.'
    ],
    breathing: 'Inhale deeply as you descend into the hole; exhale driving upward to standing.',
    mistakes: [
      'Knees caving inward (valgus collapse)',
      'Heels lifting off the ground (weight shifting onto toes)',
      'Rounding the lumbar spine at the bottom of the squat'
    ],
    setsReps: '3–4 sets × 15–20 reps',
    restSeconds: 60,
    tempo: '2-1-1-0',
    safety: 'Keep weight distributed across the whole foot with strong arch engagement.',
    regression: 'Box Squat (sitting back onto chair/bench)',
    progression: 'Goblet Squat or Barbell Back Squat'
  },

  deadlift: {
    id: 'deadlift',
    name: 'Deadlift',
    aliases: ['deadlift', 'barbell deadlift', 'conventional deadlift'],
    muscle: 'Hamstrings',
    targetEnum: 'hamstrings',
    secondaryMuscles: 'Gluteus Maximus, Erector Spinae, Lats, Traps, Forearms',
    difficulty: 'Advanced',
    equipment: 'Full Gym',
    type: 'Weights',
    thumbnail: null,
    poster: null,
    startPhoto: null,
    peakPhoto: null,
    animationUrl: null,
    videoUrl: '/exercises/videos/deadlift.webm',
    setup: 'Stand with feet hip-width, barbell over mid-foot. Hinge hips back with a flat back, grip bar outside shins, pull slack out of bar.',
    steps: [
      'Engage lats and pack upper back firmly.',
      'Push the floor away through mid-foot, keeping bar dragging close along shins.',
      'Once bar crosses knees, drive hips forward to stand tall at lockout.',
      'Lower bar by hinging hips back first until bar passes knees, then bend knees to floor.'
    ],
    breathing: 'Deep belly breath and core brace before pull; exhale at standing lockout.',
    mistakes: [
      'Rounding the lumbar spine under load',
      'Letting the bar drift forward away from the legs',
      'Hyperextending spine backward at lockout'
    ],
    setsReps: '3–4 sets × 5–8 reps',
    restSeconds: 120,
    tempo: '2-1-1-0',
    safety: 'Maintain neutral spine at all times. Stop rep immediately if form degrades.',
    regression: 'Kettlebell Romanian Deadlift or Trap Bar Deadlift',
    progression: 'Deficit Deadlift or Paused Deadlift'
  },

  lunges: {
    id: 'lunges',
    name: 'Lunges',
    aliases: ['lunges', 'walking lunges', 'forward lunges', 'bodyweight lunges'],
    muscle: 'Quads',
    targetEnum: 'quads',
    secondaryMuscles: 'Gluteus Maximus, Hamstrings, Calves, Core',
    difficulty: 'Intermediate',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/lunge_0.jpg',
    poster: '/exercises/images/lunge_0.jpg',
    startPhoto: '/exercises/images/lunge_0.jpg',
    peakPhoto: '/exercises/images/lunge_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Stand tall with feet hip-width apart, shoulders back, hands on hips or holding dumbbells.',
    steps: [
      'Take a controlled stride forward with your right leg.',
      'Lower your hips straight down until both knees form approximately 90-degree angles.',
      'Ensure front knee stays stacked directly over front ankle, rear knee hovering 1 inch off floor.',
      'Drive forcefully through the front heel to step back to the starting stance.',
      'Alternate legs on each repetition.'
    ],
    breathing: 'Inhale stepping forward and dropping down; exhale driving back to upright.',
    mistakes: [
      'Front knee traveling excessively far forward beyond toes',
      'Torso collapsing forward instead of remaining upright',
      'Banging the back knee into the hard ground'
    ],
    setsReps: '3 sets × 10–12 reps per leg',
    restSeconds: 60,
    tempo: '2-0-1-0',
    safety: 'Maintain hip alignment without tilting pelvis sideways.',
    regression: 'Reverse Lunge (easier on knee joint) or Static Split Squat',
    progression: 'Dumbbell Walking Lunges or Bulgarian Split Squats'
  },

  plank: {
    id: 'plank',
    name: 'Plank',
    aliases: ['plank', 'forearm plank', 'front plank', 'core plank'],
    muscle: 'Abs',
    targetEnum: 'abs',
    secondaryMuscles: 'Transverse Abdominis, Glutes, Shoulders, Spinal Erectors',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/plank_0.jpg',
    poster: '/exercises/images/plank_0.jpg',
    startPhoto: '/exercises/images/plank_0.jpg',
    peakPhoto: '/exercises/images/plank_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Lie prone, prop upper body on forearms with elbows directly beneath shoulders. Extend legs backward with toes tucked.',
    steps: [
      'Lift hips to create an unbroken horizontal line from crown of head to heels.',
      'Pull belly button toward spine and contract glutes and quadriceps with maximal tension.',
      'Keep gaze downward to preserve neutral cervical spine.',
      'Hold position rigidly without holding your breath.'
    ],
    breathing: 'Breathe steadily and rhythmically from diaphragm while maintaining abdominal brace.',
    mistakes: [
      'Sagging lower back (lumbar hyperextension)',
      'Piking hips into an inverted V-shape',
      'Holding breath and inducing excessive blood pressure spikes'
    ],
    setsReps: '3 sets × 30–60 seconds hold',
    restSeconds: 45,
    tempo: 'Isometric static hold',
    safety: 'Drop knees immediately if you feel pain in the lumbar spine.',
    regression: 'Kneeling Forearm Plank or Incline Plank',
    progression: 'Plank with Alternating Arm/Leg Reach or RKC Plank'
  },

  glute_bridge: {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    aliases: ['glute bridge', 'hip bridge', 'butt bridge'],
    muscle: 'Glutes',
    targetEnum: 'glutes',
    secondaryMuscles: 'Hamstrings, Lower Back, Core',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Bodyweight',
    thumbnail: '/exercises/images/glute_bridge_0.jpg',
    poster: '/exercises/images/glute_bridge_0.jpg',
    startPhoto: '/exercises/images/glute_bridge_0.jpg',
    peakPhoto: '/exercises/images/glute_bridge_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Lie on your back with knees bent at 90 degrees, feet flat on the floor hip-width apart, arms resting by your sides.',
    steps: [
      'Drive through your heels to raise your hips toward the ceiling.',
      'Squeeze your glutes tightly at the apex until your thighs and torso form a straight diagonal line.',
      'Avoid arching your lower back at the top.',
      'Lower hips slowly back toward the floor under control.'
    ],
    breathing: 'Exhale driving hips up; inhale lowering down.',
    mistakes: ['Overarching lumbar spine instead of extending through glutes', 'Pushing through toes instead of heels'],
    setsReps: '3 sets × 15 reps',
    restSeconds: 45,
    tempo: '2-1-1-1',
    safety: 'Engage abdominal wall to ensure hip hinge rather than spine arch.',
    regression: 'Short-range bodyweight bridge',
    progression: 'Single-leg Glute Bridge or Barbell Hip Thrust'
  },

  jumping_jacks: {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    aliases: ['jumping jacks', 'jumping jack', 'star jump'],
    muscle: 'Calves',
    targetEnum: 'calves',
    secondaryMuscles: 'Cardiovascular, Deltoids, Hip Abductors',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Cardio',
    thumbnail: '/exercises/images/jumping_jacks_0.jpg',
    poster: '/exercises/images/jumping_jacks_0.jpg',
    startPhoto: '/exercises/images/jumping_jacks_0.jpg',
    peakPhoto: '/exercises/images/jumping_jacks_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Stand upright with feet together and arms resting comfortably at your sides.',
    steps: [
      'In a single fluid motion, jump feet out laterally beyond shoulder width.',
      'Simultaneously sweep arms out and overhead until hands almost meet above your head.',
      'Spring lightly on the balls of your feet and jump back to the starting stance.'
    ],
    breathing: 'Maintain consistent, rhythmic breathing in sync with jumps.',
    mistakes: ['Landing flat-footed with heavy impact on knees', 'Arms flailing without control'],
    setsReps: '3 sets × 30–45 seconds',
    restSeconds: 30,
    tempo: 'Continuous cadence',
    safety: 'Land softly on balls of feet with knees slightly unlocked to absorb force.',
    regression: 'Step Jacks (stepping out one foot at a time without jumping)',
    progression: 'Burpees or Jump Rope'
  },

  dumbbell_curl: {
    id: 'dumbbell_curl',
    name: 'Dumbbell Curl',
    aliases: ['dumbbell curl', 'bicep curl', 'biceps curl', 'dumbbell bicep curl'],
    muscle: 'Biceps',
    targetEnum: 'biceps',
    secondaryMuscles: 'Brachialis, Brachioradialis, Forearms',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    type: 'Weights',
    thumbnail: '/exercises/images/db_curl_0.jpg',
    poster: '/exercises/images/db_curl_0.jpg',
    startPhoto: '/exercises/images/db_curl_0.jpg',
    peakPhoto: '/exercises/images/db_curl_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Stand tall holding a dumbbell in each hand at your sides with palms facing forward, shoulders back, elbows tucked close to ribs.',
    steps: [
      'Keep upper arms stationary and pinned against your ribcage.',
      'Inhale, then exhale as you curl the dumbbells upward toward shoulder level.',
      'Squeeze biceps forcefully for 1 second at peak contraction.',
      'Inhale as you lower the weights slowly under 2-3s control back to full extension.'
    ],
    breathing: 'Exhale curling upward; inhale lowering under control.',
    mistakes: [
      'Swinging torso and utilizing lower back momentum to lift weight',
      'Allowing elbows to drift far forward during the curl'
    ],
    setsReps: '3 sets × 10–12 reps',
    restSeconds: 60,
    tempo: '2-0-1-1',
    safety: 'Select a weight that allows pure elbow flexion without lumbar sway.',
    regression: 'Seated Incline Dumbbell Curl or Resistance Band Curl',
    progression: 'EZ-Bar Preacher Curl or Hammer Curl'
  },

  dumbbell_shoulder_press: {
    id: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    aliases: ['dumbbell shoulder press', 'overhead press', 'db shoulder press', 'seated dumbbell press'],
    muscle: 'Shoulders',
    targetEnum: 'shoulders',
    secondaryMuscles: 'Anterior & Lateral Deltoids, Triceps, Upper Traps',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells',
    type: 'Weights',
    thumbnail: '/exercises/images/shoulder_press_0.jpg',
    poster: '/exercises/images/shoulder_press_0.jpg',
    startPhoto: '/exercises/images/shoulder_press_0.jpg',
    peakPhoto: '/exercises/images/shoulder_press_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Sit or stand holding dumbbells at ear level with 90-degree elbow bend, palms facing forward or semi-neutral, core engaged.',
    steps: [
      'Brace core and glutes firmly to prevent excessive lumbar arching.',
      'Exhale and press dumbbells vertically overhead in a smooth arc until arms are extended.',
      'Avoid clanking the dumbbells together at the top.',
      'Inhale and lower dumbbells under control back to ear level.'
    ],
    breathing: 'Exhale on overhead press; inhale lowering with control.',
    mistakes: [
      'Excessively arching the lower back to compensate for poor shoulder mobility',
      'Dropping elbows too low below shoulder line under load'
    ],
    setsReps: '3 sets × 8–10 reps',
    restSeconds: 75,
    tempo: '2-0-1-0',
    safety: 'Use neutral grip (palms facing each other) if anterior shoulder pain occurs.',
    regression: 'Seated Dumbbell Shoulder Press with Back Support',
    progression: 'Standing Barbell Overhead Press'
  },

  downward_dog: {
    id: 'downward_dog',
    name: 'Downward-Facing Dog (Yoga)',
    aliases: ['downward-facing dog', 'downward dog', 'adho mukha svanasana', 'downward-facing dog (yoga)'],
    muscle: 'Hamstrings',
    targetEnum: 'hamstrings',
    secondaryMuscles: 'Calves, Latissimus Dorsi, Posterior Chain, Deltoids',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Yoga',
    thumbnail: '/exercises/images/downdog_0.jpg',
    poster: '/exercises/images/downdog_0.jpg',
    startPhoto: '/exercises/images/downdog_0.jpg',
    peakPhoto: null,
    animationUrl: null,
    videoUrl: null,
    setup: 'From hands and knees, spread fingers wide, tuck toes, lift knees, and push hips upward and back to form an inverted V-shape.',
    steps: [
      'Lengthen spine by pressing chest gently toward thighs.',
      'Pedal or press heels toward the floor to stretch posterior legs.',
      'Relax neck and gaze between knees or toward navel.',
      'Hold position taking 5 slow deep diaphragmatic breaths.'
    ],
    breathing: 'Long, deep nasal inhalations and complete exhalations.',
    mistakes: ['Rounding the upper spine instead of lengthening through tailbone'],
    setsReps: '3 holds × 30–45 seconds',
    restSeconds: 30,
    tempo: 'Static hold',
    safety: 'Bend knees slightly if hamstrings are tight to keep lower back straight.',
    regression: 'Downward Dog with bent knees or Dolphin Pose',
    progression: 'Three-Legged Dog (one leg lifted high)'
  },

  warrior_two: {
    id: 'warrior_two',
    name: 'Warrior II Pose (Yoga)',
    aliases: ['warrior ii pose', 'warrior 2', 'virabhadrasana ii', 'warrior ii pose (yoga)'],
    muscle: 'Quads',
    targetEnum: 'quads',
    secondaryMuscles: 'Glutes, Hip Adductors, Deltoids, Core',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Yoga',
    thumbnail: '/exercises/images/warrior2_0.jpg',
    poster: '/exercises/images/warrior2_0.jpg',
    startPhoto: '/exercises/images/warrior2_0.jpg',
    peakPhoto: null,
    animationUrl: null,
    videoUrl: null,
    setup: 'Step feet approximately 4 feet apart. Turn front foot forward (90 degrees) and back foot slightly angled inward (~15 degrees).',
    steps: [
      'Bend front knee to 90 degrees so knee aligns directly over front ankle.',
      'Keep back leg straight and strong, pressing into outer edge of back foot.',
      'Extend arms parallel to the ground at shoulder height, reaching actively forward and back.',
      'Gaze calmly over front middle fingertip.'
    ],
    breathing: 'Deep, steady nasal breaths expanding ribcage.',
    mistakes: ['Front knee collapsing inward past ankle line', 'Torso leaning too far forward'],
    setsReps: '2–3 holds × 30–45 seconds per side',
    restSeconds: 30,
    tempo: 'Isometric static pose',
    safety: 'Ensure front knee tracks toward middle toes to protect knee ligaments.',
    regression: 'Higher stance with less knee bend',
    progression: 'Reverse Warrior / Extended Side Angle'
  },

  cat_cow: {
    id: 'cat_cow',
    name: 'Cat-Cow Spine Mobility',
    aliases: ['cat-cow spine mobility', 'cat cow', 'cat-cow', 'cat cow stretch'],
    muscle: 'Traps',
    targetEnum: 'traps',
    secondaryMuscles: 'Spinal Erectors, Abdominals, Neck, Pelvic Girdle',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Recovery',
    thumbnail: '/exercises/images/cat_cow_0.jpg',
    poster: '/exercises/images/cat_cow_0.jpg',
    startPhoto: '/exercises/images/cat_cow_0.jpg',
    peakPhoto: '/exercises/images/cat_cow_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Start on all fours on a yoga mat with hands shoulder-width and knees hip-width beneath hips.',
    steps: [
      'Cow: Inhale, drop belly toward floor, lift chest and tailbone, gaze gently upward.',
      'Cat: Exhale, press floor away, round spine upward toward ceiling, tuck chin toward chest.',
      'Flow smoothly between positions with continuous breath.'
    ],
    breathing: 'Inhale during spinal extension (Cow); exhale during spinal flexion (Cat).',
    mistakes: ['Moving jerkily instead of articulating each vertebra smoothly'],
    setsReps: '3 sets × 10 breath cycles',
    restSeconds: 30,
    tempo: 'Slow, fluid breathing rhythm',
    safety: 'Avoid pinching the neck by keeping cervical movement gentle.',
    regression: 'Seated Cat-Cow on chair',
    progression: 'Bird-Dog Spinal Stabilization'
  },

  standing_hamstring_stretch: {
    id: 'standing_hamstring_stretch',
    name: 'Standing Hamstring Stretch',
    aliases: ['standing hamstring stretch', 'hamstring stretch'],
    muscle: 'Hamstrings',
    targetEnum: 'hamstrings',
    secondaryMuscles: 'Calves, Glutes, Lower Back',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Recovery',
    thumbnail: '/exercises/images/hamstring_stretch_0.jpg',
    poster: '/exercises/images/hamstring_stretch_0.jpg',
    startPhoto: '/exercises/images/hamstring_stretch_0.jpg',
    peakPhoto: '/exercises/images/hamstring_stretch_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Stand tall, extend one heel forward onto the ground with toes pointing upward. Rest hands on opposing bent thigh.',
    steps: [
      'Hinge hips straight backward while keeping back flat.',
      'Gently lower chest toward front thigh until a mild stretch is felt through back of leg.',
      'Hold without bouncing, breathing into the muscle belly.'
    ],
    breathing: 'Slow exhales allowing muscle fibers to lengthen.',
    mistakes: ['Rounding the lumbar spine to reach lower', 'Bouncing in the stretch'],
    setsReps: '2–3 holds × 30 seconds per leg',
    restSeconds: 30,
    tempo: 'Static stretch',
    safety: 'Do not lock out the knee joint harshly; maintain a micro-bend.',
    regression: 'Seated Hamstring Stretch',
    progression: 'Elevated Hamstring Stretch on bench'
  },

  cobra_stretch: {
    id: 'cobra_stretch',
    name: 'Cobra Core Stretch',
    aliases: ['cobra core stretch', 'cobra stretch', 'bhujangasana', 'upward dog stretch'],
    muscle: 'Abs',
    targetEnum: 'abs',
    secondaryMuscles: 'Anterior Hip Flexors, Chest, Spinal Erectors',
    difficulty: 'Beginner',
    equipment: 'No Equipment',
    type: 'Recovery',
    thumbnail: '/exercises/images/cobra_stretch_0.jpg',
    poster: '/exercises/images/cobra_stretch_0.jpg',
    startPhoto: '/exercises/images/cobra_stretch_0.jpg',
    peakPhoto: '/exercises/images/cobra_stretch_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Lie face down on mat, tops of feet flat on floor, hands planted directly under shoulders with elbows tucked close.',
    steps: [
      'Press tops of feet and pelvis into the floor.',
      'Inhale and gently push through hands to lift chest off the mat.',
      'Keep shoulders drawn back and down away from ears.',
      'Hold position comfortably while feeling abdominal elongation.'
    ],
    breathing: 'Inhale opening chest; exhale relaxing hips into floor.',
    mistakes: ['Crunching into the lower back', 'Shrugging shoulders up toward ears'],
    setsReps: '2–3 holds × 20–30 seconds',
    restSeconds: 30,
    tempo: 'Gentle static hold',
    safety: 'If lumbar pinching occurs, lower to Sphinx pose on forearms.',
    regression: 'Sphinx Pose (forearms on floor)',
    progression: 'Full Upward-Facing Dog (thighs lifted off floor)'
  },

  lat_pulldown: {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    aliases: ['lat pulldown', 'cable lat pulldown', 'wide-grip lat pulldown'],
    muscle: 'Lats',
    targetEnum: 'lats',
    secondaryMuscles: 'Biceps Brachii, Rear Deltoids, Rhomboids',
    difficulty: 'Intermediate',
    equipment: 'Full Gym',
    type: 'Machine',
    thumbnail: '/exercises/images/lat_pulldown_0.jpg',
    poster: '/exercises/images/lat_pulldown_0.jpg',
    startPhoto: '/exercises/images/lat_pulldown_0.jpg',
    peakPhoto: '/exercises/images/lat_pulldown_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Adjust thigh pad tightly over legs. Grasp wide bar with overhand grip outside shoulder width. Sit tall with chest lifted.',
    steps: [
      'Retract shoulder blades down and back.',
      'Pull bar down smoothly toward upper chest, driving elbows downward and inward.',
      'Squeeze lats at the bottom without swinging torso excessively backward.',
      'Slowly return bar upward under control to full overhead lat stretch.'
    ],
    breathing: 'Exhale pulling down; inhale extending arms upward.',
    mistakes: ['Leaning back too far and turning it into a row', 'Pulling bar behind the neck'],
    setsReps: '3–4 sets × 10–12 reps',
    restSeconds: 75,
    tempo: '2-0-1-1',
    safety: 'Always pull in front of the head to collarbone level to preserve cervical spine.',
    regression: 'Resistance Band Pulldown',
    progression: 'Bodyweight Pull-ups or Weighted Chin-ups'
  },

  leg_press: {
    id: 'leg_press',
    name: 'Leg Press',
    aliases: ['leg press', '45 degree leg press', 'machine leg press'],
    muscle: 'Quads',
    targetEnum: 'quads',
    secondaryMuscles: 'Gluteus Maximus, Hamstrings, Adductors',
    difficulty: 'Intermediate',
    equipment: 'Full Gym',
    type: 'Machine',
    thumbnail: '/exercises/images/leg_press_0.jpg',
    poster: '/exercises/images/leg_press_0.jpg',
    startPhoto: '/exercises/images/leg_press_0.jpg',
    peakPhoto: '/exercises/images/leg_press_1.jpg',
    animationUrl: null,
    videoUrl: null,
    setup: 'Sit in leg press with lower back and sacrum pressed flat against backrest. Place feet shoulder-width on footplate.',
    steps: [
      'Disengage safety levers while holding side handles firmly.',
      'Lower sled toward chest by bending knees until knees reach ~90 degrees.',
      'Keep knees tracking in line with feet, heels flat on plate.',
      'Press sled back up through mid-foot and heels, stopping just short of knee lockout.'
    ],
    breathing: 'Inhale lowering sled; exhale pressing upward.',
    mistakes: [
      'Locking knees out aggressively at the top (hyperextension risk)',
      'Allowing lower back to curl off the seat cushion at the bottom'
    ],
    setsReps: '3–4 sets × 10–12 reps',
    restSeconds: 90,
    tempo: '2-1-1-0',
    safety: 'Never hyperextend knees at lockout; keep slight tension throughout.',
    regression: 'Lighter sled resistance or Bodyweight Squat',
    progression: 'Single-leg Leg Press or Barbell Squat'
  }
};

/**
 * Resolves an exercise by its exact name or alias before using movement keywords.
 * Unknown exercises deliberately receive no unrelated demonstration asset.
 */
export function getExerciseMedia(name) {
  const normalize = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  const exerciseName = typeof name === 'string' && name.trim() ? name.trim() : 'Unknown exercise';
  const norm = normalize(exerciseName);

  for (const [key, item] of Object.entries(EXERCISE_MEDIA_MAP)) {
    if ([key, item.name, ...(item.aliases || [])].some(value => normalize(value) === norm)) {
      return item;
    }
  }

  if (norm.includes('diamond')) return EXERCISE_MEDIA_MAP.diamond_pushup;
  if (norm.includes('squeeze') && norm.includes('bench')) return EXERCISE_MEDIA_MAP.dumbbell_squeeze_press;
  if (norm.includes('bench') && norm.includes('dip') && norm.includes('floor')) return EXERCISE_MEDIA_MAP.bench_dip_floor;
  if (norm.includes('floor') && norm.includes('dip')) return EXERCISE_MEDIA_MAP.triceps_dip_floor;
  if (norm.includes('bench') && norm.includes('dip')) return EXERCISE_MEDIA_MAP.bench_dip;
  if (norm.includes('dip')) return EXERCISE_MEDIA_MAP.bench_dip;
  if (norm.includes('push') && norm.includes('down') && (norm.includes('rope') || norm.includes('cable'))) {
    return EXERCISE_MEDIA_MAP.cable_rope_pushdown;
  }
  if (norm.includes('push') && norm.includes('up')) return EXERCISE_MEDIA_MAP.pushup;
  if (norm.includes('bench') && norm.includes('press')) {
    if (norm.includes('dumbbell') || norm.includes('db')) {
      return norm.includes('squeeze')
        ? EXERCISE_MEDIA_MAP.dumbbell_squeeze_press
        : EXERCISE_MEDIA_MAP.dumbbell_bench_press;
    }
    return EXERCISE_MEDIA_MAP.barbell_bench_press;
  }
  if (norm.includes('deadlift')) return EXERCISE_MEDIA_MAP.deadlift;
  if (norm.includes('squat')) return EXERCISE_MEDIA_MAP.squat;
  if (norm.includes('lunge')) return EXERCISE_MEDIA_MAP.lunges;
  if (norm.includes('plank')) return EXERCISE_MEDIA_MAP.plank;
  if (norm.includes('bridge')) return EXERCISE_MEDIA_MAP.glute_bridge;
  if (norm.includes('jump')) return EXERCISE_MEDIA_MAP.jumping_jacks;
  if (norm.includes('curl') || norm.includes('bicep')) return EXERCISE_MEDIA_MAP.dumbbell_curl;
  if (norm.includes('shoulder') || norm.includes('overhead')) return EXERCISE_MEDIA_MAP.dumbbell_shoulder_press;
  if (norm.includes('dog') || norm.includes('adho')) return EXERCISE_MEDIA_MAP.downward_dog;
  if (norm.includes('warrior')) return EXERCISE_MEDIA_MAP.warrior_two;
  if (norm.includes('cat') || norm.includes('cow')) return EXERCISE_MEDIA_MAP.cat_cow;
  if (norm.includes('hamstring') || norm.includes('leg stretch')) return EXERCISE_MEDIA_MAP.standing_hamstring_stretch;
  if (norm.includes('cobra') || norm.includes('ab stretch')) return EXERCISE_MEDIA_MAP.cobra_stretch;
  if (norm.includes('pull') && (norm.includes('down') || norm.includes('lat'))) return EXERCISE_MEDIA_MAP.lat_pulldown;
  if (norm.includes('leg press')) return EXERCISE_MEDIA_MAP.leg_press;

  return {
    id: null,
    name: exerciseName,
    aliases: [],
    muscle: 'Not specified',
    targetEnum: '',
    secondaryMuscles: 'Not specified',
    difficulty: 'Not specified',
    equipment: 'Check workout plan',
    type: 'Exercise',
    thumbnail: null,
    poster: null,
    startPhoto: null,
    peakPhoto: null,
    animationUrl: null,
    videoUrl: null,
    setup: '',
    steps: [],
    breathing: 'Breathe steadily and avoid holding your breath.',
    mistakes: [],
    setsReps: 'Follow your workout plan',
    restSeconds: null,
    tempo: 'Controlled movement',
    safety: 'Use a comfortable range of motion and stop if you feel pain.',
    regression: 'Ask a qualified coach for a suitable alternative.',
    progression: 'Ask a qualified coach for a suitable progression.',
    availabilityMessage: `A verified human demonstration for ${exerciseName} has not been supplied yet. Follow your plan instructions until an exercise-specific photo or video is added.`
  };
}

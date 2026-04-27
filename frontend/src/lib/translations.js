export const translations = {
  en: {
    // Navigation
    workspace: 'Workspace',
    allTasks: 'All Tasks',
    today: 'Today',
    completed: 'Completed',
    account: 'Account',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'العربية',
    signOut: 'Sign out',
    freePlan: 'Free plan',

    // Tasks page
    allTasksTitle: 'All Tasks 📋',
    tasksTotal: (n) => `${n} task${n !== 1 ? 's' : ''} total`,
    newTask: 'New Task',
    aiBtn: 'AI',
    sortBtn: 'Sort',
    newestFirst: 'Newest First',
    byDueDate: 'Due Date',
    byPriority: 'Priority',

    // Stat cards
    total: 'Total',
    active: 'Active',
    done: 'Done',
    highPriority: 'High ⚠',

    // Filters
    searchPlaceholder: 'Search tasks…',
    allStatuses: 'All statuses',
    toDo: 'To Do',
    inProgress: 'In Progress',
    allPriorities: 'All priorities',
    high: 'High',
    medium: 'Medium',
    low: 'Low',

    // AI banner
    aiOrderApplied: 'AI order applied — tasks reordered by smart priority',
    reset: 'Reset',

    // Task list
    completedSection: (n) => `Completed (${n})`,
    noTasksYet: 'No tasks yet',
    noMatchingTasks: 'No matching tasks',
    createFirstTaskDesc: 'Create your first task to get started',
    tryAdjustingFilters: 'Try adjusting your filters',
    createFirstTaskBtn: 'Create First Task',

    // AI Chat
    aiChatTitle: 'AI Assistant',
    aiChatPlaceholder: 'Ask me to create, edit, delete or prioritize tasks…',
    aiChatWelcome: "Hi! I can help you manage your tasks. Try saying:\n• \"Create a task to buy groceries due tomorrow\"\n• \"Prioritize my tasks\"\n• \"Delete the task about groceries\"",

    // TaskModal
    newTaskModalTitle: '✨ New Task',
    editTaskModalTitle: '✏️ Edit Task',
    titleLabel: 'Title',
    titlePlaceholder: 'What needs to be done?',
    titleRequired: 'Title is required',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Add more details…',
    priorityLabel: 'Priority',
    statusLabel: 'Status',
    dueDateLabel: 'Due Date',
    categoryLabel: 'Category',
    categoryPlaceholder: 'Work, Personal…',
    cancelBtn: 'Cancel',
    saveChangesBtn: 'Save Changes',
    createTaskBtn: 'Create Task',
    savingBtn: 'Saving…',

    // Priority/Status options
    highOpt: '🔴 High',
    mediumOpt: '🟡 Medium',
    lowOpt: '🟢 Low',
    todoOpt: 'To Do',
    inProgressOpt: 'In Progress',
    doneOpt: 'Done',

    // Today page
    todayTitle: 'Today 📅',
    allClear: 'All clear for today!',
    allClearDesc: 'No tasks due. Enjoy your day!',
    overdue: 'Overdue',
    dueToday: 'Due Today',

    // Completed page
    completedTitle: 'Completed ✅',
    completedCount: (n) => `${n} completed task${n !== 1 ? 's' : ''}`,
    noCompletedYet: 'Nothing completed yet',
    noCompletedDesc: 'Tasks you mark as done will appear here',

    // Account page
    accountTitle: 'Account 👤',
    accountSubtitle: 'Manage your profile and security',
    memberSince: 'Member since',
    totalTasksLabel: 'Total Tasks',
    completedLabel: 'Completed',
    completionRateLabel: 'Completion Rate',
    changePasswordTitle: 'Change Password 🔐',
    changePasswordSubtitle: 'Choose a strong new password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    passwordPlaceholder: 'At least 6 characters',
    confirmPlaceholder: 'Repeat password',
    updatePasswordBtn: 'Update Password',
    updatingBtn: 'Updating…',

    // Settings page
    settingsTitle: 'Settings ⚙️',
    settingsSubtitle: 'Customize your TaskFlow experience',
    taskDefaultsTitle: 'Task Defaults',
    taskDefaultsSubtitle: 'Pre-fill values when creating new tasks',
    defaultPriorityLabel: 'Default Priority',
    defaultStatusLabel: 'Default Status',
    behaviorTitle: 'Behavior',
    behaviorSubtitle: 'Control how the app behaves',
    confirmDeleteLabel: 'Confirm before deleting',
    confirmDeleteDesc: 'Show a dialog before permanently deleting a task',
    aboutTitle: 'About TaskFlow',
    aboutSubtitle: 'Built with modern tools',
    versionLabel: 'Version',

    // Confirm dialog
    deleteConfirm: 'Delete this task?',
  },

  ar: {
    // Navigation
    workspace: 'مساحة العمل',
    allTasks: 'جميع المهام',
    today: 'اليوم',
    completed: 'المكتملة',
    account: 'الحساب',
    settings: 'الإعدادات',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    language: 'English',
    signOut: 'تسجيل الخروج',
    freePlan: 'الخطة المجانية',

    // Tasks page
    allTasksTitle: 'جميع المهام 📋',
    tasksTotal: (n) => `${n} ${n === 1 ? 'مهمة' : 'مهام'} إجمالاً`,
    newTask: 'مهمة جديدة',
    aiBtn: 'ذكاء اصطناعي',
    sortBtn: 'ترتيب',
    newestFirst: 'الأحدث أولاً',
    byDueDate: 'تاريخ الاستحقاق',
    byPriority: 'الأولوية',

    // Stat cards
    total: 'الإجمالي',
    active: 'النشطة',
    done: 'المكتملة',
    highPriority: 'أولوية عالية ⚠',

    // Filters
    searchPlaceholder: 'ابحث عن المهام…',
    allStatuses: 'جميع الحالات',
    toDo: 'للقيام به',
    inProgress: 'قيد التنفيذ',
    allPriorities: 'جميع الأولويات',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',

    // AI banner
    aiOrderApplied: 'تم تطبيق ترتيب الذكاء الاصطناعي — تمت إعادة ترتيب المهام',
    reset: 'إعادة تعيين',

    // Task list
    completedSection: (n) => `مكتملة (${n})`,
    noTasksYet: 'لا توجد مهام بعد',
    noMatchingTasks: 'لا توجد مهام مطابقة',
    createFirstTaskDesc: 'أنشئ مهمتك الأولى للبدء',
    tryAdjustingFilters: 'حاول تعديل الفلاتر',
    createFirstTaskBtn: 'إنشاء المهمة الأولى',

    // AI Chat
    aiChatTitle: 'مساعد الذكاء الاصطناعي',
    aiChatPlaceholder: 'اطلب مني إنشاء أو تعديل أو حذف المهام…',
    aiChatWelcome: 'مرحباً! يمكنني مساعدتك في إدارة مهامك. جرب قول:\n• "أنشئ مهمة لشراء البقالة غداً"\n• "رتب مهامي حسب الأولوية"\n• "احذف مهمة البقالة"',

    // TaskModal
    newTaskModalTitle: '✨ مهمة جديدة',
    editTaskModalTitle: '✏️ تعديل المهمة',
    titleLabel: 'العنوان',
    titlePlaceholder: 'ما الذي يجب فعله؟',
    titleRequired: 'العنوان مطلوب',
    descriptionLabel: 'الوصف',
    descriptionPlaceholder: 'أضف مزيداً من التفاصيل…',
    priorityLabel: 'الأولوية',
    statusLabel: 'الحالة',
    dueDateLabel: 'تاريخ الاستحقاق',
    categoryLabel: 'الفئة',
    categoryPlaceholder: 'عمل، شخصي…',
    cancelBtn: 'إلغاء',
    saveChangesBtn: 'حفظ التغييرات',
    createTaskBtn: 'إنشاء المهمة',
    savingBtn: 'جارٍ الحفظ…',

    // Priority/Status options
    highOpt: '🔴 عالية',
    mediumOpt: '🟡 متوسطة',
    lowOpt: '🟢 منخفضة',
    todoOpt: 'للقيام به',
    inProgressOpt: 'قيد التنفيذ',
    doneOpt: 'منجزة',

    // Today page
    todayTitle: 'اليوم 📅',
    allClear: 'لا شيء مستحق اليوم!',
    allClearDesc: 'لا توجد مهام مستحقة. استمتع بيومك!',
    overdue: 'متأخرة',
    dueToday: 'مستحقة اليوم',

    // Completed page
    completedTitle: 'المكتملة ✅',
    completedCount: (n) => `${n} ${n === 1 ? 'مهمة مكتملة' : 'مهام مكتملة'}`,
    noCompletedYet: 'لا توجد مهام مكتملة بعد',
    noCompletedDesc: 'ستظهر هنا المهام التي تضع عليها علامة منجزة',

    // Account page
    accountTitle: 'الحساب 👤',
    accountSubtitle: 'إدارة ملفك الشخصي والأمان',
    memberSince: 'عضو منذ',
    totalTasksLabel: 'إجمالي المهام',
    completedLabel: 'المكتملة',
    completionRateLabel: 'معدل الإنجاز',
    changePasswordTitle: 'تغيير كلمة المرور 🔐',
    changePasswordSubtitle: 'اختر كلمة مرور قوية جديدة',
    newPasswordLabel: 'كلمة المرور الجديدة',
    confirmPasswordLabel: 'تأكيد كلمة المرور الجديدة',
    passwordPlaceholder: '٦ أحرف على الأقل',
    confirmPlaceholder: 'أعد كتابة كلمة المرور',
    updatePasswordBtn: 'تحديث كلمة المرور',
    updatingBtn: 'جارٍ التحديث…',

    // Settings page
    settingsTitle: 'الإعدادات ⚙️',
    settingsSubtitle: 'خصص تجربتك في TaskFlow',
    taskDefaultsTitle: 'الإعدادات الافتراضية للمهام',
    taskDefaultsSubtitle: 'القيم الافتراضية عند إنشاء مهام جديدة',
    defaultPriorityLabel: 'الأولوية الافتراضية',
    defaultStatusLabel: 'الحالة الافتراضية',
    behaviorTitle: 'السلوك',
    behaviorSubtitle: 'التحكم في طريقة عمل التطبيق',
    confirmDeleteLabel: 'تأكيد قبل الحذف',
    confirmDeleteDesc: 'عرض نافذة تأكيد قبل حذف المهمة نهائياً',
    aboutTitle: 'حول TaskFlow',
    aboutSubtitle: 'مبني بأدوات حديثة',
    versionLabel: 'الإصدار',

    // Confirm dialog
    deleteConfirm: 'هل تريد حذف هذه المهمة؟',
  },
};

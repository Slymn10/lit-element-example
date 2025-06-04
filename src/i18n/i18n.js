const resources = {
  en: {
    translation: {
      // App
      appTitle: 'Employee Management',
      language: 'Language',

      // Navigation
      employees: 'Employees',
      addNew: 'Add New',

      // Employee List
      employeeList: 'Employee List',
      tableView: 'Table View',
      listView: 'List View',
      search: 'Search',
      noEmployeesFound: 'No employees found',

      // Employee Fields
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfEmployment: 'Date of Employment',
      dateOfBirth: 'Date of Birth',
      phoneNumber: 'Phone',
      email: 'Email',
      department: 'Department',
      position: 'Position',

      // Departments
      analytics: 'Analytics',
      tech: 'Tech',
      selectDepartment: 'Select Department',

      // Positions
      junior: 'Junior',
      medior: 'Medior',
      senior: 'Senior',
      selectPosition: 'Select Position',

      // Actions
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      proceed: 'Proceed',
      goBack: 'Go Back',

      // Forms
      addEmployee: 'Add Employee',
      editEmployee: 'Edit Employee',

      // Confirmation
      confirmDelete: 'Are you sure?',
      deleteConfirmationText:
        'Selected Employee record of {firstName} {lastName} will be deleted',
      confirmUpdate: 'Update Employee?',
      updateConfirmationText:
        'Are you sure you want to update this employee record?',

      // Error messages
      required: 'This field is required',
      invalidEmail: 'Email is not valid',
      emailInUse: 'Email is already in use',
      invalidPhone: 'Phone number format should be +XX XXX XXX XX XX',
      pastDateRequired: 'Date must be in the past',
      atLeast18Required: 'Employee must be at least 18 years old',

      // Pagination
      page: 'Page',
      of: 'of',

      // Not Found
      notFound: 'Page Not Found',
      notFoundMessage: 'The page you are looking for does not exist.',
      returnHome: 'Return to Home',
    },
  },
  tr: {
    translation: {
      // App
      appTitle: 'Çalışan Yönetimi',
      language: 'Dil',

      // Navigation
      employees: 'Çalışanlar',
      addNew: 'Yeni Ekle',

      // Employee List
      employeeList: 'Çalışan Listesi',
      tableView: 'Tablo Görünümü',
      listView: 'Liste Görünümü',
      search: 'Ara',
      noEmployeesFound: 'Çalışan bulunamadı',

      // Employee Fields
      firstName: 'Ad',
      lastName: 'Soyad',
      dateOfEmployment: 'İşe Başlama Tarihi',
      dateOfBirth: 'Doğum Tarihi',
      phoneNumber: 'Telefon',
      email: 'E-posta',
      department: 'Departman',
      position: 'Pozisyon',

      // Departments
      analytics: 'Analitik',
      tech: 'Teknoloji',
      selectDepartment: 'Departman Seç',

      // Positions
      junior: 'Junior',
      medior: 'Medior',
      senior: 'Senior',
      selectPosition: 'Pozisyon Seç',

      // Actions
      actions: 'İşlemler',
      edit: 'Düzenle',
      delete: 'Sil',
      save: 'Kaydet',
      cancel: 'İptal',
      proceed: 'Devam Et',
      goBack: 'Geri Dön',

      // Forms
      addEmployee: 'Çalışan Ekle',
      editEmployee: 'Çalışan Düzenle',

      // Confirmation
      confirmDelete: 'Emin misiniz?',
      deleteConfirmationText:
        '{firstName} {lastName} adlı çalışan kaydı silinecek',
      confirmUpdate: 'Çalışan Güncellensin mi?',
      updateConfirmationText:
        'Bu çalışan kaydını güncellemek istediğinize emin misiniz?',

      // Error messages
      required: 'Bu alan zorunludur',
      invalidEmail: 'E-posta geçerli değil',
      emailInUse: 'E-posta zaten kullanımda',
      invalidPhone: 'Telefon numarası formatı +XX XXX XXX XX XX olmalıdır',
      pastDateRequired: 'Tarih geçmiş bir tarih olmalıdır',
      atLeast18Required: 'Çalışan en az 18 yaşında olmalıdır',

      // Pagination
      page: 'Sayfa',
      of: '/',

      // Not Found
      notFound: 'Sayfa Bulunamadı',
      notFoundMessage: 'Aradığınız sayfa mevcut değil.',
      returnHome: 'Ana Sayfaya Dön',
    },
  },
};

let currentTranslations = resources.en.translation;

export function loadTranslations(language) {
  currentTranslations =
    resources[language]?.translation || resources.en.translation;
}

export function t(key) {
  return currentTranslations[key] || key;
}

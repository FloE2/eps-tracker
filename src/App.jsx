import React, { useState, useEffect } from 'react';
import { User, Activity, BarChart3, Plus, Download, Upload, ChevronDown, Edit2, Trash2, Info } from 'lucide-react';

// Configuration des tests avec descriptions complètes
const TEST_CATEGORIES = {
  'Force': {
    color: 'bg-rose-700',
    tests: [
      { 
        id: 'poignee_main', 
        name: 'Poignée de main', 
        unit: 'kg', 
        fields: ['main_droite', 'main_gauche'],
        description: 'Mesure la force de préhension des mains',
        detailedDescription: 'Test de force maximale de préhension. L\'élève serre le dynamomètre de toutes ses forces, bras tendu le long du corps. Effectuer 2 essais par main et retenir le meilleur.'
      },
      { 
        id: 'suspension_barre', 
        name: 'Suspension barre', 
        unit: 'sec', 
        fields: ['temps'],
        description: 'Mesure la force d\'endurance des bras en suspension',
        detailedDescription: 'L\'élève se suspend à une barre fixe, bras fléchis, menton au-dessus de la barre. Chronométrer jusqu\'à ce que le menton passe sous la barre ou que l\'élève lâche.'
      },
      { 
        id: 'chaise_killy', 
        name: 'Chaise de Killy', 
        unit: 'sec', 
        fields: ['temps'],
        description: 'Test d\'endurance musculaire des cuisses',
        detailedDescription: 'Position assise contre un mur, cuisses horizontales, jambes verticales, angle de 90°. Maintenir la position le plus longtemps possible. Arrêt quand les cuisses ne sont plus horizontales.'
      },
      { 
        id: 'saut_longueur_2pieds', 
        name: 'Saut en longueur 2 pieds', 
        unit: 'cm', 
        fields: ['distance'],
        description: 'Mesure la puissance explosive des jambes',
        detailedDescription: 'Saut en longueur sans élan, pieds parallèles derrière la ligne. L\'élève fléchit les jambes et saute le plus loin possible. Mesurer depuis la ligne jusqu\'au talon le plus proche. Meilleur de 2 essais.'
      },
      { 
        id: 'planche', 
        name: 'Planche', 
        unit: 'sec', 
        fields: ['temps'],
        description: 'Test d\'endurance de la sangle abdominale',
        detailedDescription: 'Position de planche : appui sur avant-bras et pointes de pieds, corps gainé en ligne droite. Maintenir la position le plus longtemps possible. Arrêt si les hanches montent ou descendent.'
      }
    ]
  },
  'Coordination': {
    color: 'bg-orange-600',
    tests: [
      { 
        id: 'lancer_ballon', 
        name: 'Lancer de ballon', 
        unit: 'points', 
        fields: ['score'],
        description: 'Test de coordination œil-main avec lancer de précision',
        detailedDescription: 'Lancer un ballon dans des cibles concentriques. 10 essais. Cœur = 5 points, 1er cercle = 3 points, 2ème cercle = 1 point, à côté = 0 point. Score total sur 50.'
      },
      { 
        id: '5_foulees_bondissantes', 
        name: '5 Foulées bondissantes', 
        unit: 'cm', 
        fields: ['distance'],
        description: 'Test de coordination et de puissance en enchaînement',
        detailedDescription: 'Enchaînement de 5 bonds alternatifs en avançant. Départ pieds joints, puis alternance droite-gauche-droite-gauche-droite. Mesurer la distance totale parcourue. 2 essais.'
      },
      { 
        id: 'triple_saut_1pied', 
        name: 'Triple saut sur un pied', 
        unit: 'cm', 
        fields: ['pied_droit', 'pied_gauche'],
        description: 'Test de coordination et d\'équilibre dynamique',
        detailedDescription: '3 sauts consécutifs sur le même pied en avançant. Départ derrière la ligne, enchaîner sans temps d\'arrêt. Mesurer la distance depuis la ligne jusqu\'à l\'impact du 3ème saut. Tester les deux pieds.'
      }
    ]
  },
  'Vitesse': {
    color: 'bg-yellow-600',
    tests: [
      { 
        id: '10x5m', 
        name: '10 x 5m', 
        unit: 'sec', 
        fields: ['temps'],
        description: 'Test de vitesse en navettes courtes',
        detailedDescription: 'Course navette sur 5 mètres. 10 allers-retours le plus rapidement possible en touchant la ligne à chaque fois. Départ debout, chronométrage au signal. 1 essai.'
      }
    ]
  },
  'Équilibre': {
    color: 'bg-green-600',
    tests: [
      { 
        id: 'equilibre_monopodal', 
        name: 'Équilibre monopodal', 
        unit: 'sec', 
        fields: ['yeux_ouverts', 'yeux_fermes'],
        description: 'Test d\'équilibre statique sur un pied',
        detailedDescription: 'Tenir en équilibre sur un pied, l\'autre jambe fléchie. Chronométrer jusqu\'à ce que le pied posé bouge ou que l\'autre pied touche le sol. Test yeux ouverts puis yeux fermés. Maximum 60 secondes.'
      },
      { 
        id: 'flamingo_poutre', 
        name: 'Flamingo sur poutre', 
        unit: 'nb_chutes', 
        fields: ['nb_chutes'],
        description: 'Test d\'équilibre dynamique sur poutre',
        detailedDescription: 'Équilibre sur un pied sur une poutre (largeur 3cm), l\'autre jambe fléchie maintenue par la main. Compter le nombre de chutes (pied qui bouge, perte d\'équilibre) en 1 minute.'
      }
    ]
  },
  'Souplesse': {
    color: 'bg-blue-600',
    tests: [
      { 
        id: 'souplesse_posterieure', 
        name: 'Souplesse postérieure', 
        unit: 'cm', 
        fields: ['distance'],
        description: 'Test de flexibilité de la chaîne postérieure',
        detailedDescription: 'Assis jambes tendues, pieds contre le caisson. Fléchir le tronc vers l\'avant et pousser le curseur le plus loin possible avec les doigts. Maintenir 2 secondes. Meilleur de 2 essais.'
      },
      { 
        id: 'souplesse_epaules', 
        name: 'Souplesse épaules', 
        unit: 'cm', 
        fields: ['epaule_droite', 'epaule_gauche'],
        description: 'Test de mobilité articulaire des épaules',
        detailedDescription: 'L\'élève tient un bâton, un bras par-dessus l\'épaule, l\'autre par-dessous, dans le dos. Mesurer la distance entre les mains (plus c\'est proche, mieux c\'est). Si les mains se touchent = 0cm. Tester les deux côtés.'
      }
    ]
  },
  'Endurance': {
    color: 'bg-indigo-600',
    tests: [
      { 
        id: 'vameval', 
        name: 'Vameval', 
        unit: 'palier', 
        fields: ['palier'],
        description: 'Test d\'endurance cardiovasculaire progressif',
        detailedDescription: 'Course navette sur 20 mètres avec augmentation progressive de la vitesse. Départ à 8 km/h (palier 1), +0.5 km/h toutes les minutes. L\'élève doit être dans la zone d\'arrivée au signal sonore. Arrêt quand il ne peut plus suivre le rythme (2 signaux manqués). Noter le dernier palier atteint.'
      }
    ]
  }
};

function FitnessTracker() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedClass, setSelectedClass] = useState('6A');
  
  // État vide - pas d'élèves générés automatiquement
  const [allStudents, setAllStudents] = useState([]);
  const [results, setResults] = useState({});
  const [customTests, setCustomTests] = useState({});
  const [showTestInfo, setShowTestInfo] = useState(null);
  
  // État pour la création d'élèves
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Combinaison des tests par défaut et des tests personnalisés
  const getAllTestCategories = () => {
    const combinedCategories = {};
    
    Object.entries(TEST_CATEGORIES).forEach(([categoryName, categoryData]) => {
      combinedCategories[categoryName] = {
        color: categoryData.color,
        tests: categoryData.tests.map(test => ({
          id: test.id,
          name: test.name,
          unit: test.unit,
          fields: [...test.fields],
          description: test.description || '',
          detailedDescription: test.detailedDescription || ''
        }))
      };
    });
    
    Object.entries(customTests).forEach(([categoryName, tests]) => {
      if (combinedCategories[categoryName]) {
        combinedCategories[categoryName].tests = [
          ...combinedCategories[categoryName].tests,
          ...tests
        ];
      } else {
        combinedCategories[categoryName] = {
          color: 'bg-gray-600',
          tests: tests
        };
      }
    });
    
    return combinedCategories;
  };

  const testCategories = getAllTestCategories();

  // Calculs statistiques
  const classes = ['6A', '6B', '6C', '5A', '5B', '5C', '4A', '4B', '4C', '3A', '3B', '3C'];
  const totalTests = Object.values(testCategories).reduce((acc, cat) => acc + cat.tests.length, 0);
  const studentsInClass = allStudents.filter(s => s.classe === selectedClass);

  // Fonction pour ajouter un élève
  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      ...studentData,
      age: calculateAge(studentData.dateNaissance)
    };
    setAllStudents(prev => [...prev, newStudent]);
    setShowAddStudent(false);
  };

  // Fonction pour modifier un élève
  const updateStudent = (studentId, updatedData) => {
    setAllStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, ...updatedData, age: calculateAge(updatedData.dateNaissance) }
        : student
    ));
    setEditingStudent(null);
  };

  // Fonction pour supprimer un élève
  const deleteStudent = (studentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      setAllStudents(prev => prev.filter(student => student.id !== studentId));
      // Supprimer aussi ses résultats
      setResults(prev => {
        const newResults = { ...prev };
        delete newResults[studentId];
        return newResults;
      });
    }
  };

  // Fonction pour calculer l'âge
  const calculateAge = (dateNaissance) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fonctions de navigation avec focus
  const navigateToStudents = () => setCurrentView('students');
  const navigateToQuickEntry = () => setCurrentView('quick-entry');
  const navigateToTests = (category = null) => {
    setCurrentView('tests');
    if (category) {
      setSelectedCategory(category);
      setTimeout(() => {
        const element = document.getElementById(`category-${category}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.outline = '3px solid #3b82f6';
          element.style.outlineOffset = '4px';
          setTimeout(() => {
            element.style.outline = 'none';
            element.style.outlineOffset = '0px';
          }, 3000);
        }
      }, 100);
    }
  };

  // Formulaire d'ajout d'élève
  const AddStudentForm = () => {
    const [formData, setFormData] = useState({
      nom: '',
      prenom: '',
      classe: '6A',
      dateNaissance: '',
      genre: ''
    });

    const handleSubmit = () => {
      if (formData.nom && formData.prenom && formData.classe && formData.dateNaissance && formData.genre) {
        addStudent(formData);
        setFormData({
          nom: '',
          prenom: '',
          classe: '6A',
          dateNaissance: '',
          genre: ''
        });
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
          <h3 className="text-xl font-bold text-white mb-4">Ajouter un élève</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value.toUpperCase() }))}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Classe</label>
              <select
                value={formData.classe}
                onChange={(e) => setFormData(prev => ({ ...prev, classe: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              >
                {classes.map(classe => (
                  <option key={classe} value={classe}>{classe}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date de naissance</label>
              <input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddStudent(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Formulaire de modification d'élève
  const EditStudentForm = ({ student }) => {
    const [formData, setFormData] = useState({
      nom: student.nom,
      prenom: student.prenom,
      classe: student.classe,
      dateNaissance: student.dateNaissance,
      genre: student.genre
    });

    const handleSubmit = () => {
      updateStudent(student.id, formData);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
          <h3 className="text-xl font-bold text-white mb-4">Modifier l'élève</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value.toUpperCase() }))}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Classe</label>
              <select
                value={formData.classe}
                onChange={(e) => setFormData(prev => ({ ...prev, classe: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              >
                {classes.map(classe => (
                  <option key={classe} value={classe}>{classe}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date de naissance</label>
              <input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setEditingStudent(null)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Vue Dashboard
  const DashboardView = () => (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Collège EPS Santé YDM</h1>
        <p className="text-gray-400">Suivi de la condition physique des élèves</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          onClick={navigateToStudents}
          className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
        >
          <User className="mx-auto mb-3 text-blue-400" size={48} />
          <h3 className="text-2xl font-bold text-white">{allStudents.length}</h3>
          <p className="text-gray-400">Élèves</p>
        </div>
        
        <div 
          onClick={navigateToQuickEntry}
          className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
        >
          <Activity className="mx-auto mb-3 text-green-400" size={48} />
          <h3 className="text-2xl font-bold text-white">{classes.length}</h3>
          <p className="text-gray-400">Classes</p>
        </div>
        
        <div 
          onClick={() => navigateToTests()}
          className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
        >
          <BarChart3 className="mx-auto mb-3 text-purple-400" size={48} />
          <h3 className="text-2xl font-bold text-white">{totalTests}</h3>
          <p className="text-gray-400">Tests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(testCategories).map(([categoryName, category]) => (
          <div 
            key={categoryName}
            onClick={() => navigateToTests(categoryName)}
            className={`${category.color} bg-opacity-20 border-2 border-opacity-30 rounded-lg p-4 text-center hover:bg-opacity-30 cursor-pointer transition-all border-current`}
          >
            <h3 className="font-semibold text-white mb-2">{categoryName}</h3>
            <p className="text-2xl font-bold text-white">{category.tests.length}</p>
            <p className="text-sm text-gray-300">Tests disponibles</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Vue Saisie rapide
  const QuickEntryView = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Saisie rapide</h2>
      
      {allStudents.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto mb-4 text-gray-500" size={64} />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun élève enregistré</h3>
          <p className="text-gray-500 mb-4">Ajoutez d'abord des élèves pour pouvoir saisir des résultats</p>
          <button
            onClick={() => setCurrentView('students')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Aller à la gestion des élèves
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-300 mb-2">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {classes.map(classe => (
                <option key={classe} value={classe}>{classe}</option>
              ))}
            </select>
            <p className="text-sm text-gray-400 mt-2">
              {studentsInClass.length} élève(s) dans cette classe
            </p>
          </div>

          {studentsInClass.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucun élève dans la classe {selectedClass}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Tests disponibles</h3>
              {Object.entries(testCategories).map(([categoryName, category]) => (
                <div key={categoryName} className="bg-gray-800 rounded-lg p-4">
                  <h4 className={`font-medium text-white mb-3 ${category.color} bg-opacity-20 p-2 rounded`}>
                    {categoryName}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.tests.map(test => (
                      <div
                        key={test.id}
                        onClick={() => setSelectedTest(test)}
                        className="p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <div className="font-medium text-white">{test.name}</div>
                        <div className="text-sm text-gray-400 italic">{test.description}</div>
                        <div className="text-xs text-gray-500 mt-1">Unité: {test.unit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Vue Élèves
  const StudentsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('');

    const filteredStudents = allStudents.filter(student => {
      const matchesSearch = `${student.prenom} ${student.nom}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = !filterClass || student.classe === filterClass;
      return matchesSearch && matchesClass;
    });

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gestion des élèves</h2>
          <button
            onClick={() => setShowAddStudent(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter un élève
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rechercher</label>
              <input
                type="text"
                placeholder="Nom ou prénom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filtrer par classe</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Toutes les classes</option>
                {classes.map(classe => (
                  <option key={classe} value={classe}>{classe}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {allStudents.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto mb-4 text-gray-500" size={64} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun élève enregistré</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter des élèves à votre base de données</p>
            <button
              onClick={() => setShowAddStudent(true)}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-500 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Ajouter le premier élève
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Nom</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Prénom</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Classe</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Âge</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Genre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-white">{student.nom}</td>
                      <td className="px-4 py-3 text-white">{student.prenom}</td>
                      <td className="px-4 py-3 text-white">{student.classe}</td>
                      <td className="px-4 py-3 text-white">{student.age} ans</td>
                      <td className="px-4 py-3 text-white">{student.genre === 'M' ? 'Masculin' : 'Féminin'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingStudent(student)}
                            className="text-blue-400 hover:text-blue-300"
                            title="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredStudents.length === 0 && allStudents.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucun élève trouvé avec ces critères</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          Total: {filteredStudents.length} élève(s) affiché(s) sur {allStudents.length}
        </div>
      </div>
    );
  };

  // Vue Tests
  const TestsView = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Gestion des tests</h2>
      
      <div className="space-y-6">
        {Object.entries(testCategories).map(([categoryName, category]) => (
          <div 
            key={categoryName} 
            id={`category-${categoryName}`}
            className={`${category.color} bg-opacity-10 border border-opacity-30 rounded-lg p-6 transition-all border-current`}
          >
            <h3 className="text-xl font-bold text-white mb-4">{categoryName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tests.map(test => (
                <div key={test.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{test.name}</h4>
                    <button
                      onClick={() => setShowTestInfo(test)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Informations détaillées"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 italic mb-2">{test.description}</p>
                  <p className="text-xs text-gray-400">Unité: {test.unit}</p>
                  <p className="text-xs text-gray-400">
                    Champs: {test.fields.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Vue Analyses (placeholder)
  const AnalysesView = () => (
    <div className="p-6 text-center">
      <BarChart3 className="mx-auto mb-4 text-gray-500" size={64} />
      <h2 className="text-2xl font-bold text-white mb-4">Analyses</h2>
      <p className="text-gray-400">Module d'analyses statistiques en développement</p>
    </div>
  );

  // Modal d'informations sur les tests
  const TestInfoModal = ({ test }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{test.name}</h3>
          <button
            onClick={() => setShowTestInfo(null)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300">Description courte:</h4>
            <p className="text-white">{test.description}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-300">Protocole détaillé:</h4>
            <p className="text-white text-sm">{test.detailedDescription}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-300">Unité de mesure:</h4>
            <p className="text-white">{test.unit}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-300">Champs de saisie:</h4>
            <p className="text-white">{test.fields.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">EPS Santé YDM - Collège</h1>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Tableau de bord
              </button>
              <button
                onClick={() => setCurrentView('quick-entry')}
                className={`px-4 py-2 rounded ${currentView === 'quick-entry' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Saisie rapide
              </button>
              <button
                onClick={() => setCurrentView('students')}
                className={`px-4 py-2 rounded ${currentView === 'students' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Élèves
              </button>
              <button
                onClick={() => setCurrentView('tests')}
                className={`px-4 py-2 rounded ${currentView === 'tests' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Tests
              </button>
              <button
                onClick={() => setCurrentView('analyses')}
                className={`px-4 py-2 rounded ${currentView === 'analyses' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Analyses
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'quick-entry' && <QuickEntryView />}
        {currentView === 'students' && <StudentsView />}
        {currentView === 'tests' && <TestsView />}
        {currentView === 'analyses' && <AnalysesView />}
      </main>

      {showAddStudent && <AddStudentForm />}
      {editingStudent && <EditStudentForm student={editingStudent} />}
      {showTestInfo && <TestInfoModal test={showTestInfo} />}
    </div>
  );
}

export default FitnessTracker;
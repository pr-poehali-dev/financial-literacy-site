import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface BudgetData {
  income: number;
  expenses: {
    housing: number;
    food: number;
    transport: number;
    entertainment: number;
    savings: number;
  };
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface InvestmentData {
  amount: number;
  years: number;
  interestRate: number;
  monthlyContribution: number;
}

interface UserProgress {
  quizScore: number;
  completedTests: number;
  budgetPlans: number;
}

const Index = () => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: 0,
    expenses: {
      housing: 0,
      food: 0,
      transport: 0,
      entertainment: 0,
      savings: 0,
    },
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [investmentData, setInvestmentData] = useState<InvestmentData>({
    amount: 0,
    years: 0,
    interestRate: 0,
    monthlyContribution: 0
  });
  const [userProgress, setUserProgress] = useState<UserProgress>({
    quizScore: 0,
    completedTests: 0,
    budgetPlans: 0
  });

  const allQuizQuestions: QuizQuestion[] = [
    // Beginner Level
    {
      id: 1,
      question: "Какой процент дохода рекомендуется откладывать на сбережения?",
      options: ["5%", "10-20%", "30%", "50%"],
      correct: 1,
      explanation: "Финансовые эксперты рекомендуют откладывать 10-20% от дохода на сбережения и инвестиции.",
      difficulty: 'beginner'
    },
    {
      id: 2,
      question: "Что такое экстренный фонд?",
      options: [
        "Деньги на развлечения",
        "Накопления на отпуск",
        "Резерв на 3-6 месяцев расходов",
        "Инвестиционный портфель"
      ],
      correct: 2,
      explanation: "Экстренный фонд должен покрывать ваши расходы на 3-6 месяцев в случае потери дохода.",
      difficulty: 'beginner'
    },
    {
      id: 3,
      question: "Какое правило помогает контролировать импульсивные покупки?",
      options: [
        "Правило 24 часов",
        "Покупать сразу",
        "Брать кредит",
        "Откладывать на год"
      ],
      correct: 0,
      explanation: "Правило 24 часов: подождите день перед крупной покупкой, чтобы убедиться в её необходимости.",
      difficulty: 'beginner'
    },
    {
      id: 4,
      question: "Что означает правило 50/30/20?",
      options: [
        "50% развлечения, 30% еда, 20% жильё",
        "50% необходимые расходы, 30% желания, 20% сбережения",
        "50% сбережения, 30% развлечения, 20% еда",
        "50% инвестиции, 30% налоги, 20% расходы"
      ],
      correct: 1,
      explanation: "Правило 50/30/20 помогает сбалансированно распределить доходы между основными категориями расходов.",
      difficulty: 'beginner'
    },
    // Intermediate Level
    {
      id: 5,
      question: "Что такое диверсификация инвестиций?",
      options: [
        "Вложение всех денег в одну акцию",
        "Распределение инвестиций между разными активами",
        "Покупка только государственных облигаций",
        "Инвестирование только в недвижимость"
      ],
      correct: 1,
      explanation: "Диверсификация снижает риски путём распределения инвестиций между различными типами активов.",
      difficulty: 'intermediate'
    },
    {
      id: 6,
      question: "Какова основная цель ребалансировки портфеля?",
      options: [
        "Увеличить доходность любой ценой",
        "Поддерживать желаемое соотношение активов",
        "Продать все убыточные активы",
        "Купить только растущие акции"
      ],
      correct: 1,
      explanation: "Ребалансировка помогает поддерживать целевое распределение активов в соответствии с инвестиционной стратегией.",
      difficulty: 'intermediate'
    },
    {
      id: 7,
      question: "Что показывает коэффициент Шарпа?",
      options: [
        "Только доходность инвестиции",
        "Отношение доходности к принятому риску",
        "Количество сделок в году",
        "Размер комиссии брокера"
      ],
      correct: 1,
      explanation: "Коэффициент Шарпа измеряет эффективность инвестиций с учётом принятого риска.",
      difficulty: 'intermediate'
    },
    // Advanced Level
    {
      id: 8,
      question: "Что такое эффект сложного процента?",
      options: [
        "Простое начисление процентов",
        "Начисление процентов на проценты",
        "Вычет налогов с процентов",
        "Ежемесячная выплата процентов"
      ],
      correct: 1,
      explanation: "Сложный процент - это начисление процентов не только на основную сумму, но и на уже начисленные проценты.",
      difficulty: 'advanced'
    },
    {
      id: 9,
      question: "Что означает валютное хеджирование?",
      options: [
        "Покупка только рублёвых активов",
        "Защита от валютных рисков",
        "Инвестирование в криптовалюту",
        "Обмен валют каждый день"
      ],
      correct: 1,
      explanation: "Валютное хеджирование позволяет защитить портфель от неблагоприятных изменений курсов валют.",
      difficulty: 'advanced'
    },
    {
      id: 10,
      question: "Какой показатель лучше всего отражает реальную доходность с учётом инфляции?",
      options: [
        "Номинальная доходность",
        "Реальная доходность",
        "Средняя доходность",
        "Максимальная доходность"
      ],
      correct: 1,
      explanation: "Реальная доходность учитывает влияние инфляции и показывает фактический рост покупательной способности.",
      difficulty: 'advanced'
    }
  ];

  const quizQuestions = allQuizQuestions.filter(q => q.difficulty === selectedDifficulty);

  const totalExpenses = Object.values(budgetData.expenses).reduce((sum, val) => sum + val, 0);
  const remainingBudget = budgetData.income - totalExpenses;
  const savingsRate = budgetData.income > 0 ? (budgetData.expenses.savings / budgetData.income) * 100 : 0;

  const handleInputChange = (field: string, value: number) => {
    if (field === 'income') {
      setBudgetData(prev => ({ ...prev, income: value }));
    } else {
      setBudgetData(prev => ({
        ...prev,
        expenses: { ...prev.expenses, [field]: value }
      }));
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < quizQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setQuizStarted(false);
  };

  const saveUserProgress = () => {
    const newProgress = {
      quizScore: Math.max(userProgress.quizScore, score),
      completedTests: userProgress.completedTests + 1,
      budgetPlans: userProgress.budgetPlans + (budgetData.income > 0 ? 1 : 0)
    };
    setUserProgress(newProgress);
    localStorage.setItem('financeProgress', JSON.stringify(newProgress));
  };

  useEffect(() => {
    const saved = localStorage.getItem('financeProgress');
    if (saved) {
      setUserProgress(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (showResults) {
      saveUserProgress();
    }
  }, [showResults]);

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">
                Финансовая грамотность —<br />
                <span className="text-blue-600">ключ к успеху</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Научитесь управлять деньгами, планировать бюджет и достигать финансовых целей. 
                Профессиональные инструменты и знания для вашего благополучия.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Icon name="Calculator" className="mr-2" size={20} />
                  Начать расчёт
                </Button>
                <Button variant="outline" size="lg">
                  <Icon name="BookOpen" className="mr-2" size={20} />
                  Изучить советы
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/img/2f5788ba-6ecc-4a92-bbea-34130f5977bc.jpg"
                alt="Финансовое планирование"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      {(userProgress.completedTests > 0 || userProgress.budgetPlans > 0) && (
        <section className="py-12 px-4 bg-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-8">Ваш прогресс</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Icon name="Award" className="mx-auto mb-3 text-yellow-600" size={32} />
                  <div className="text-2xl font-bold text-slate-800">{userProgress.quizScore}</div>
                  <div className="text-sm text-slate-600">Лучший результат теста</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Icon name="Brain" className="mx-auto mb-3 text-blue-600" size={32} />
                  <div className="text-2xl font-bold text-slate-800">{userProgress.completedTests}</div>
                  <div className="text-sm text-slate-600">Пройдено тестов</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Icon name="Calculator" className="mx-auto mb-3 text-green-600" size={32} />
                  <div className="text-2xl font-bold text-slate-800">{userProgress.budgetPlans}</div>
                  <div className="text-sm text-slate-600">Планов бюджета</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Всё для управления финансами
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Calculator" size={32} className="text-blue-600" />
                </div>
                <CardTitle>Калькуляторы бюджета</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Точные расчёты доходов, расходов и планирование сбережений
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="TrendingUp" size={32} className="text-green-600" />
                </div>
                <CardTitle>Практические советы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Проверенные стратегии экономии и инвестирования
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Brain" size={32} className="text-purple-600" />
                </div>
                <CardTitle>Тесты знаний</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Проверьте свой уровень финансовой грамотности
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="calculator" className="text-lg">
                <Icon name="Calculator" className="mr-2" size={20} />
                Бюджет
              </TabsTrigger>
              <TabsTrigger value="investment" className="text-lg">
                <Icon name="TrendingUp" className="mr-2" size={20} />
                Инвестиции
              </TabsTrigger>
              <TabsTrigger value="tips" className="text-lg">
                <Icon name="Lightbulb" className="mr-2" size={20} />
                Советы
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-lg">
                <Icon name="Brain" className="mr-2" size={20} />
                Тест
              </TabsTrigger>
            </TabsList>

            {/* Calculator Tab */}
            <TabsContent value="calculator">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="PiggyBank" className="mr-2" />
                      Планировщик бюджета
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="income">Месячный доход (₽)</Label>
                      <Input
                        id="income"
                        type="number"
                        placeholder="Введите доход"
                        onChange={(e) => handleInputChange('income', Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Расходы по категориям:</h4>
                      
                      <div>
                        <Label>Жильё и коммунальные услуги</Label>
                        <Input
                          type="number"
                          placeholder="₽"
                          onChange={(e) => handleInputChange('housing', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Питание</Label>
                        <Input
                          type="number"
                          placeholder="₽"
                          onChange={(e) => handleInputChange('food', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Транспорт</Label>
                        <Input
                          type="number"
                          placeholder="₽"
                          onChange={(e) => handleInputChange('transport', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Развлечения</Label>
                        <Input
                          type="number"
                          placeholder="₽"
                          onChange={(e) => handleInputChange('entertainment', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Сбережения</Label>
                        <Input
                          type="number"
                          placeholder="₽"
                          onChange={(e) => handleInputChange('savings', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="BarChart3" className="mr-2" />
                      Анализ бюджета
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-800">
                        {remainingBudget.toLocaleString()} ₽
                      </div>
                      <div className={`text-sm ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {remainingBudget >= 0 ? 'Остаток бюджета' : 'Превышение бюджета'}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Норма сбережений</span>
                          <span className={savingsRate >= 10 ? 'text-green-600' : 'text-red-600'}>
                            {savingsRate.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={Math.min(savingsRate, 100)} className="h-2" />
                        <p className="text-xs text-slate-500 mt-1">
                          Рекомендуемая норма: 10-20%
                        </p>
                      </div>

                      {budgetData.income > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold">Распределение расходов:</h4>
                          {Object.entries(budgetData.expenses).map(([key, value]) => {
                            const percentage = (value / budgetData.income) * 100;
                            const labels = {
                              housing: 'Жильё',
                              food: 'Питание',
                              transport: 'Транспорт',
                              entertainment: 'Развлечения',
                              savings: 'Сбережения'
                            };
                            return (
                              <div key={key} className="flex justify-between items-center">
                                <span className="text-sm">{labels[key as keyof typeof labels]}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{percentage.toFixed(1)}%</span>
                                  <div className="w-20 bg-slate-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {budgetData.income > 0 && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">💡 Рекомендации:</h4>
                        <div className="text-sm text-slate-600 space-y-1">
                          {savingsRate < 10 && <p>• Увеличьте долю сбережений до 10-20%</p>}
                          {(budgetData.expenses.housing / budgetData.income) * 100 > 30 && 
                            <p>• Расходы на жильё превышают рекомендуемые 30%</p>}
                          {remainingBudget < 0 && <p>• Сократите расходы или увеличьте доход</p>}
                          {remainingBudget > 0 && savingsRate >= 10 && 
                            <p>• Отличный баланс! Рассмотрите инвестирование</p>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tips Tab */}
            <TabsContent value="tips">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Icon name="Target" className="mr-2 text-blue-600" />
                      Правило 50/30/20
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Распределяйте доход: 50% на необходимые расходы, 30% на желания, 20% на сбережения.
                    </p>
                    <Badge variant="secondary">Базовое планирование</Badge>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Icon name="Shield" className="mr-2 text-green-600" />
                      Экстренный фонд
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Создайте резерв на 3-6 месяцев расходов для непредвиденных ситуаций.
                    </p>
                    <Badge variant="secondary">Финансовая защита</Badge>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Icon name="Zap" className="mr-2 text-yellow-600" />
                      Автоматизация
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Настройте автоматические переводы на сберегательные счета.
                    </p>
                    <Badge variant="secondary">Эффективность</Badge>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Icon name="TrendingDown" className="mr-2 text-red-600" />
                      Контроль долгов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Погашайте долги с высокими процентами в первую очередь.
                    </p>
                    <Badge variant="secondary">Оптимизация</Badge>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Icon name="Clock" className="mr-2 text-purple-600" />
                      Правило 24 часов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Подождите сутки перед крупными покупками, чтобы избежать импульсивных трат.
                    </p>
                    <Badge variant="secondary">Осознанность</Badge>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Icon name="GraduationCap" className="mr-2 text-indigo-600" />
                      Инвестиции в себя
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Инвестируйте в образование и навыки — это лучший способ увеличить доход.
                    </p>
                    <Badge variant="secondary">Развитие</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Investment Tab */}
            <TabsContent value="investment">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="TrendingUp" className="mr-2" />
                      Калькулятор инвестиций
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="initialAmount">Начальная сумма (₽)</Label>
                      <Input
                        id="initialAmount"
                        type="number"
                        placeholder="Введите сумму"
                        onChange={(e) => setInvestmentData(prev => ({...prev, amount: Number(e.target.value)}))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="monthlyContribution">Ежемесячный взнос (₽)</Label>
                      <Input
                        id="monthlyContribution"
                        type="number"
                        placeholder="Дополнительные взносы"
                        onChange={(e) => setInvestmentData(prev => ({...prev, monthlyContribution: Number(e.target.value)}))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="years">Срок инвестирования (лет)</Label>
                      <Input
                        id="years"
                        type="number"
                        placeholder="Количество лет"
                        onChange={(e) => setInvestmentData(prev => ({...prev, years: Number(e.target.value)}))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="interestRate">Ожидаемая доходность (% в год)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        placeholder="Например: 8"
                        onChange={(e) => setInvestmentData(prev => ({...prev, interestRate: Number(e.target.value)}))}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="LineChart" className="mr-2" />
                      Прогноз роста капитала
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(() => {
                      const { amount, years, interestRate, monthlyContribution } = investmentData;
                      const monthlyRate = interestRate / 100 / 12;
                      const totalMonths = years * 12;
                      
                      // Формула для расчета сложного процента с ежемесячными взносами
                      const futureValueInitial = amount > 0 ? amount * Math.pow(1 + monthlyRate, totalMonths) : 0;
                      const futureValueMonthly = monthlyContribution > 0 && monthlyRate > 0 ? 
                        monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) : 0;
                      
                      const totalFutureValue = futureValueInitial + futureValueMonthly;
                      const totalInvested = amount + (monthlyContribution * totalMonths);
                      const profit = totalFutureValue - totalInvested;

                      return (
                        <>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {totalFutureValue.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                            </div>
                            <div className="text-sm text-slate-600">
                              Капитал через {years} лет
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600">Вложено всего:</span>
                                <span className="font-semibold">
                                  {totalInvested.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                                </span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600">Прибыль:</span>
                                <span className="font-semibold text-green-600">
                                  {profit.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Доходность:</span>
                                <span className="font-semibold text-blue-600">
                                  {totalInvested > 0 ? ((profit / totalInvested) * 100).toFixed(1) : 0}%
                                </span>
                              </div>
                            </div>

                            {years > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Рост по годам:</h4>
                                {Array.from({length: Math.min(years, 5)}, (_, i) => {
                                  const year = i + 1;
                                  const yearlyMonths = year * 12;
                                  const yearlyInitial = amount > 0 ? amount * Math.pow(1 + monthlyRate, yearlyMonths) : 0;
                                  const yearlyMonthly = monthlyContribution > 0 && monthlyRate > 0 ? 
                                    monthlyContribution * ((Math.pow(1 + monthlyRate, yearlyMonths) - 1) / monthlyRate) : 0;
                                  const yearlyTotal = yearlyInitial + yearlyMonthly;
                                  
                                  return (
                                    <div key={year} className="flex justify-between text-sm">
                                      <span>Год {year}:</span>
                                      <span className="font-medium">
                                        {yearlyTotal.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                                      </span>
                                    </div>
                                  );
                                })}
                                {years > 5 && (
                                  <div className="text-xs text-slate-500 text-center mt-2">
                                    ... показано первые 5 лет
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {amount > 0 && years > 0 && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center">
                                <Icon name="Lightbulb" className="mr-2" size={16} />
                                Рекомендации:
                              </h4>
                              <div className="text-sm text-slate-600 space-y-1">
                                {interestRate < 8 && <p>• Рассмотрите более доходные инструменты (ETF, акции)</p>}
                                {monthlyContribution === 0 && <p>• Регулярные взносы увеличат итоговую сумму</p>}
                                {years < 5 && <p>• Долгосрочные инвестиции более эффективны</p>}
                                {years >= 10 && interestRate >= 8 && <p>• Отличная стратегия долгосрочного накопления!</p>}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz">
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-2xl">
                    <Icon name="Brain" className="mr-2" />
                    Тест финансовой грамотности
                  </CardTitle>
                  <p className="text-slate-600">
                    Проверьте свои знания в области управления финансами
                  </p>
                </CardHeader>
                <CardContent>
                  {!quizStarted && !showResults && (
                    <div className="text-center space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <Icon name="Info" className="mx-auto mb-4 text-blue-600" size={48} />
                        <h3 className="font-semibold mb-2">Выберите уровень сложности:</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <Button
                            variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
                            onClick={() => setSelectedDifficulty('beginner')}
                            className="p-4 h-auto flex-col"
                          >
                            <Icon name="Sprout" className="mb-2" size={24} />
                            <div>
                              <div className="font-semibold">Начальный</div>
                              <div className="text-xs opacity-75">Основы финансов</div>
                            </div>
                          </Button>
                          
                          <Button
                            variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
                            onClick={() => setSelectedDifficulty('intermediate')}
                            className="p-4 h-auto flex-col"
                          >
                            <Icon name="Target" className="mb-2" size={24} />
                            <div>
                              <div className="font-semibold">Средний</div>
                              <div className="text-xs opacity-75">Инвестиции</div>
                            </div>
                          </Button>
                          
                          <Button
                            variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
                            onClick={() => setSelectedDifficulty('advanced')}
                            className="p-4 h-auto flex-col"
                          >
                            <Icon name="Trophy" className="mb-2" size={24} />
                            <div>
                              <div className="font-semibold">Продвинутый</div>
                              <div className="text-xs opacity-75">Эксперт</div>
                            </div>
                          </Button>
                        </div>
                        
                        <p className="text-slate-600 mt-4">
                          {quizQuestions.length} вопросов уровня "{selectedDifficulty === 'beginner' ? 'Начальный' : selectedDifficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}"
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => setQuizStarted(true)}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={quizQuestions.length === 0}
                      >
                        Начать тест
                      </Button>
                    </div>
                  )}

                  {quizStarted && !showResults && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          Вопрос {currentQuestion + 1} из {quizQuestions.length}
                        </Badge>
                        <Progress 
                          value={((currentQuestion + 1) / quizQuestions.length) * 100} 
                          className="w-32"
                        />
                      </div>

                      <div className="bg-slate-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">
                          {quizQuestions[currentQuestion].question}
                        </h3>
                        <div className="space-y-3">
                          {quizQuestions[currentQuestion].options.map((option, index) => (
                            <Button
                              key={index}
                              variant={
                                selectedAnswer === index
                                  ? index === quizQuestions[currentQuestion].correct
                                    ? "default"
                                    : "destructive"
                                  : "outline"
                              }
                              className={`w-full justify-start text-left ${
                                selectedAnswer !== null && index === quizQuestions[currentQuestion].correct
                                  ? "bg-green-600 hover:bg-green-700"
                                  : ""
                              }`}
                              onClick={() => handleQuizAnswer(index)}
                              disabled={selectedAnswer !== null}
                            >
                              {option}
                              {selectedAnswer !== null && index === quizQuestions[currentQuestion].correct && (
                                <Icon name="Check" className="ml-auto" size={16} />
                              )}
                              {selectedAnswer === index && index !== quizQuestions[currentQuestion].correct && (
                                <Icon name="X" className="ml-auto" size={16} />
                              )}
                            </Button>
                          ))}
                        </div>

                        {selectedAnswer !== null && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold flex items-center">
                              <Icon name="Lightbulb" className="mr-2" size={16} />
                              Объяснение:
                            </h4>
                            <p className="text-sm text-slate-600 mt-2">
                              {quizQuestions[currentQuestion].explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {showResults && (
                    <div className="text-center space-y-6">
                      <div className="bg-slate-50 p-8 rounded-lg">
                        <h3 className="text-2xl font-bold mb-4">Результаты теста</h3>
                        <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
                          {score} из {quizQuestions.length}
                        </div>
                        <div className={`text-lg ${getScoreColor()}`}>
                          {Math.round((score / quizQuestions.length) * 100)}% правильных ответов
                        </div>

                        <div className="mt-6">
                          {score === quizQuestions.length && (
                            <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                              <Icon name="Trophy" className="mx-auto mb-2" size={32} />
                              <p className="font-semibold">Отлично! Вы показали высокий уровень финансовой грамотности!</p>
                            </div>
                          )}
                          {score >= quizQuestions.length * 0.7 && score < quizQuestions.length && (
                            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                              <Icon name="Star" className="mx-auto mb-2" size={32} />
                              <p className="font-semibold">Хороший результат! Есть ещё возможности для улучшения.</p>
                            </div>
                          )}
                          {score < quizQuestions.length * 0.7 && (
                            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
                              <Icon name="BookOpen" className="mx-auto mb-2" size={32} />
                              <p className="font-semibold">Рекомендуем изучить больше материалов по финансовому планированию.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button 
                        onClick={resetQuiz}
                        variant="outline"
                        className="mx-auto"
                      >
                        Пройти тест заново
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Начните контролировать свои финансы уже сегодня
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Используйте наши инструменты для планирования бюджета и достижения финансовых целей
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-slate-800 hover:bg-slate-100">
              <Icon name="Calculator" className="mr-2" size={20} />
              Рассчитать бюджет
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-800">
              <Icon name="Download" className="mr-2" size={20} />
              Скачать гид
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
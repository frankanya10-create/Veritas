export type Locale = "en" | "es" | "fr" | "de" | "ja" | "zh" | "ar" | "pt";

export interface TranslationSet {
  nav: {
    dashboard: string;
    compliance: string;
    evidence: string;
    aiTools: string;
    ledger: string;
    settings: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    cta: string;
    features: string;
  };
  dashboard: {
    totalFrameworks: string;
    activeControls: string;
    openFindings: string;
    lastAudit: string;
    complianceScore: string;
    recentActivity: string;
    systemStatus: string;
  };
  compliance: {
    title: string;
    crossMap: string;
    frameworks: string;
    controls: string;
    status: string;
    mapped: string;
  };
  evidence: {
    title: string;
    ingest: string;
    parser: string;
    rawLogs: string;
    processed: string;
    pending: string;
  };
  ai: {
    title: string;
    oracle: string;
    guardrail: string;
    chaosAudit: string;
    queryPlaceholder: string;
    analyzing: string;
  };
  ledger: {
    title: string;
    chain: string;
    verified: string;
    tampered: string;
    hash: string;
    timestamp: string;
  };
}

const translations: Record<Locale, TranslationSet> = {
  en: {
    nav: {
      dashboard: "Dashboard",
      compliance: "Compliance",
      evidence: "Evidence",
      aiTools: "AI Tools",
      ledger: "Ledger",
      settings: "Settings",
    },
    landing: {
      heroTitle: "VERITAS",
      heroSubtitle: "Autonomous Compliance Intelligence Engine",
      cta: "Initialize System",
      features: "Core Modules",
    },
    dashboard: {
      totalFrameworks: "Total Frameworks",
      activeControls: "Active Controls",
      openFindings: "Open Findings",
      lastAudit: "Last Audit",
      complianceScore: "Compliance Score",
      recentActivity: "Recent Activity",
      systemStatus: "System Status",
    },
    compliance: {
      title: "Compliance Cross-Mapper",
      crossMap: "Cross-Map",
      frameworks: "Frameworks",
      controls: "Controls",
      status: "Status",
      mapped: "Mapped",
    },
    evidence: {
      title: "Evidence Ingestion Engine",
      ingest: "Ingest",
      parser: "Parser",
      rawLogs: "Raw Logs",
      processed: "Processed",
      pending: "Pending",
    },
    ai: {
      title: "AI Intelligence Suite",
      oracle: "Regulation Oracle",
      guardrail: "PR Guardrail",
      chaosAudit: "Chaos Auditor",
      queryPlaceholder: "Query regulatory framework...",
      analyzing: "Analyzing...",
    },
    ledger: {
      title: "Tamper-Evident Ledger",
      chain: "Chain of Custody",
      verified: "Verified",
      tampered: "Tampered",
      hash: "Hash",
      timestamp: "Timestamp",
    },
  },
  es: {
    nav: {
      dashboard: "Panel",
      compliance: "Cumplimiento",
      evidence: "Evidencia",
      aiTools: "Herramientas IA",
      ledger: "Registro",
      settings: "Configuración",
    },
    landing: {
      heroTitle: "VERITAS",
      heroSubtitle: "Motor de Inteligencia de Cumplimiento Autónomo",
      cta: "Inicializar Sistema",
      features: "Módulos Principales",
    },
    dashboard: {
      totalFrameworks: "Marcos Totales",
      activeControls: "Controles Activos",
      openFindings: "Hallazgos Abiertos",
      lastAudit: "Última Auditoría",
      complianceScore: "Puntuación de Cumplimiento",
      recentActivity: "Actividad Reciente",
      systemStatus: "Estado del Sistema",
    },
    compliance: {
      title: "Mapa Cruzado de Cumplimiento",
      crossMap: "Mapa Cruzado",
      frameworks: "Marcos",
      controls: "Controles",
      status: "Estado",
      mapped: "Mapeado",
    },
    evidence: {
      title: "Motor de Ingesta de Evidencia",
      ingest: "Ingesta",
      parser: "Parser",
      rawLogs: "Registros Crudos",
      processed: "Procesados",
      pending: "Pendientes",
    },
    ai: {
      title: "Suite de Inteligencia IA",
      oracle: "Oráculo Regulatorio",
      guardrail: "Guarda PR",
      chaosAudit: "Auditor Caos",
      queryPlaceholder: "Consultar marco regulatorio...",
      analyzing: "Analizando...",
    },
    ledger: {
      title: "Registro Anti-Tamper",
      chain: "Cadena de Custodia",
      verified: "Verificado",
      tampered: "Manipulado",
      hash: "Hash",
      timestamp: "Marca de Tiempo",
    },
  },
  fr: {
    nav: {
      dashboard: "Tableau de Bord",
      compliance: "Conformité",
      evidence: "Preuves",
      aiTools: "Outils IA",
      ledger: "Registre",
      settings: "Paramètres",
    },
    landing: {
      heroTitle: "VERITAS",
      heroSubtitle: "Moteur d'Intelligence de Conformité Autonome",
      cta: "Initialiser le Système",
      features: "Modules Principaux",
    },
    dashboard: {
      totalFrameworks: "Cadres Totaux",
      activeControls: "Contrôles Actifs",
      openFindings: "Constats Ouverts",
      lastAudit: "Dernier Audit",
      complianceScore: "Score de Conformité",
      recentActivity: "Activité Récente",
      systemStatus: " État du Système",
    },
    compliance: {
      title: "Cartographie Croisée de Conformité",
      crossMap: "Cartographie",
      frameworks: "Cadres",
      controls: "Contrôles",
      status: "État",
      mapped: "Cartographié",
    },
    evidence: {
      title: "Moteur d'Ingestion de Preuves",
      ingest: "Ingestion",
      parser: "Analyseur",
      rawLogs: "Journaux Bruts",
      processed: "Traités",
      pending: "En Attente",
    },
    ai: {
      title: "Suite d'Intelligence IA",
      oracle: "Oracle Réglementaire",
      guardrail: "Gardefou PR",
      chaosAudit: "Auditeur Chaos",
      queryPlaceholder: "Interroger le cadre réglementaire...",
      analyzing: "Analyse...",
    },
    ledger: {
      title: "Registre Anti-Falsification",
      chain: "Chaîne de Custodie",
      verified: "Vérifié",
      tampered: "Falsifié",
      hash: "Hash",
      timestamp: "Horodatage",
    },
  },
  de: {
    nav: {
      dashboard: "Dashboard",
      compliance: "Compliance",
      evidence: "Beweise",
      aiTools: "KI-Werkzeuge",
      ledger: "Register",
      settings: "Einstellungen",
    },
    landing: {
      heroTitle: "VERITAS",
      heroSubtitle: "Autonome Compliance-Intelligenz-Engine",
      cta: "System Initialisieren",
      features: "Hauptmodule",
    },
    dashboard: {
      totalFrameworks: "Gesamte Rahmenwerke",
      activeControls: "Aktive Kontrollen",
      openFindings: "Offene Feststellungen",
      lastAudit: "Letzte Prüfung",
      complianceScore: "Compliance-Score",
      recentActivity: "Letzte Aktivität",
      systemStatus: "Systemstatus",
    },
    compliance: {
      title: "Compliance-Kreuzzuordnung",
      crossMap: "Kreuzzuordnung",
      frameworks: "Rahmenwerke",
      controls: "Kontrollen",
      status: "Status",
      mapped: "Zugeordnet",
    },
    evidence: {
      title: "Beweis-Ingestions-Engine",
      ingest: "Ingestion",
      parser: "Parser",
      rawLogs: "Roh-Logs",
      processed: "Verarbeitet",
      pending: "Ausstehend",
    },
    ai: {
      title: "KI-Intelligenz-Suite",
      oracle: "Regulierungs-Orakel",
      guardrail: "PR-Schutz",
      chaosAudit: "Chaos-Auditor",
      queryPlaceholder: "Regulierungsrahmen abfragen...",
      analyzing: "Analysiere...",
    },
    ledger: {
      title: "Fälschungssicheres Register",
      chain: "Herkunftskette",
      verified: "Verifiziert",
      tampered: "Manipuliert",
      hash: "Hash",
      timestamp: "Zeitstempel",
    },
  },
  ja: {
    nav: {
      dashboard: "ダッシューランド",
      compliance: "コンパイアンス",
      evidence: "証拥",
      aiTools: "AIツール",
      ledger: "台謙",
      settings: "設定",
    },
    landing: {
      heroTitle: "VERITAS",
      heroSubtitle: "自動合規インテリジェンジン",
      cta: "システム初始化",
      features: "主要モジュール",
    },
    dashboard: {
      totalFrameworks: "総フレームワーク",
      activeControls: "アクティブコントロール",
      openFindings: "開放中の登録",
      lastAudit: "最終监査",
      complianceScore: "合規スコア",
      recentActivity: "最近の活動",
      systemStatus: "システム状態",
    },
    compliance: {
      title: "合規クロスマッピング",
      crossMap: "クロスマッピング",
      frameworks: "フレームワーク",
      controls: "コントロール",
      status: "状態",
      mapped: "マッピング済み",
    },
    evidence: {
      title: "証拥受付エンジン",
      ingest: "受付",
      parser: "パーサー",
      rawLogs: "生ログ",
      processed: "処理済み",
      pending: "保留中",
    },
    ai: {
      title: "AIインテリジェンスイート",
      oracle: "規制オラクル",
      guardrail: "PRガードレイル",
      chaosAudit: "カオス监査員",
      queryPlaceholder: "規制フレームワークを問い合わせ...",
      analyzing: "分析中...",
    },
    ledger: {
      title: "篡政防止台謙",
      chain: "管理鏡",
      verified: "検証済み",
      tampered: "篡改登録",
      hash: "ハッシュ",
      timestamp: "タイムスタンプ",
    },
  },
  zh: {
    nav: {
      dashboard: "仪表板",
      compliance: "合规",
      evidence: "证据",
      aiTools: "AI工具",
      ledger: "账本",
      settings: "设置",
    },
    landing: {
      heroTitle: "VERITAS",
      heroSubtitle: "自主合规智能引擎",
      cta: "初始化系统",
      features: "核心模块",
    },
    dashboard: {
      totalFrameworks: "总框架数",
      activeControls: "活跃控制",
      openFindings: "开放发现",
      lastAudit: "最近审计",
      complianceScore: "合规得分",
      recentActivity: "最近活动",
      systemStatus: "系统状态",
    },
    compliance: {
      title: "合规交叉映射",
      crossMap: "交叉映射",
      frameworks: "框架",
      controls: "控制",
      status: "状态",
      mapped: "已映射",
    },
    evidence: {
      title: "证据摄取引擎",
      ingest: "摄取",
      parser: "解析器",
      rawLogs: "原始日志",
      processed: "已处理",
      pending: "待处理",
    },
    ai: {
      title: "AI智能套件",
      oracle: "法规坑诓",
      guardrail: "PR护栏",
      chaosAudit: "混沌审计员",
      queryPlaceholder: "查询法规框架...",
      analyzing: "分析中...",
    },
    ledger: {
      title: "防篡改账本",
      chain: "管理链",
      verified: "已验证",
      tampered: "已篡改",
      hash: "哈希",
      timestamp: "时间戳",
    },
  },
  ar: {
    nav: {
      dashboard: "لوحة المعلومات",
      compliance: "الامتثال",
      evidence: "الأدليل",
      aiTools: "أدوات AI",
      ledger: "الدفتر",
      settings: "الإعدادات",
    },
    landing: {
      heroTitle: "VERITAS",
      heroSubtitle: "محرر المعلومات الذكائي المستقل",
      cta: "تهيئة النظام",
      features: "الوحدات الرئيسية",
    },
    dashboard: {
      totalFrameworks: "إجمالي الإطارات",
      activeControls: "الرقابت النشطة",
      openFindings: "النتائج المفتوحة",
      lastAudit: "آخر تدقيق",
      complianceScore: "نسبة الامتثال",
      recentActivity: "النشاط الأخيرة",
      systemStatus: "حالة النظام",
    },
    compliance: {
      title: "خريطة الامتثال المصلبة",
      crossMap: "خريطة",
      frameworks: "الإطارات",
      controls: "الرقابت",
      status: "الحالة",
      mapped: "مصلحة",
    },
    evidence: {
      title: "محرر استهلاك الأدليل",
      ingest: "استهلاك",
      parser: "محلل",
      rawLogs: "السجلات الغير معالجة",
      processed: "معالجة",
      pending: "قيد الانجاز",
    },
    ai: {
      title: "حزم الذكائي AI",
      oracle: "أستارة الوضاعت",
      guardrail: "حماية PR",
      chaosAudit: "مدقق الفوضى",
      queryPlaceholder: "استفسار الإطار...",
      analyzing: "جاري التحليل...",
    },
    ledger: {
      title: "سجل محافظ ضد التغيير",
      chain: "سلسل الحراسة",
      verified: "متأكد",
      tampered: "مغاصر فيه",
      hash: "التشافر",
      timestamp: "البعض الزمني",
    },
  },
  pt: {
    nav: {
      dashboard: "Painel",
      compliance: "Conformidade",
      evidence: "Evidências",
      aiTools: "Ferramentas IA",
      ledger: "Registro",
      settings: "Configurações",
    },
    landing: {
      heroTitle: "VERITAS",
      heroSubtitle: "Motor de Inteligência de Conformidade Autônomo",
      cta: "Inicializar Sistema",
      features: "Módulos Principais",
    },
    dashboard: {
      totalFrameworks: "Total de Frameworks",
      activeControls: "Controles Ativos",
      openFindings: "Constatações Abertas",
      lastAudit: "Última Auditoria",
      complianceScore: "Pontuação de Conformidade",
      recentActivity: "Atividade Recente",
      systemStatus: "Status do Sistema",
    },
    compliance: {
      title: "Mapeamento Cruzado de Conformidade",
      crossMap: "Mapeamento",
      frameworks: "Frameworks",
      controls: "Controles",
      status: "Status",
      mapped: "Mapeado",
    },
    evidence: {
      title: "Motor de Ingestão de Evidências",
      ingest: "Ingestão",
      parser: "Analisador",
      rawLogs: "Logs Brutos",
      processed: "Processados",
      pending: "Pendentes",
    },
    ai: {
      title: "Suite de Inteligência IA",
      oracle: "Oráculo Regulatório",
      guardrail: "Guarda PR",
      chaosAudit: "Auditor Caos",
      queryPlaceholder: "Consultar framework regulatório...",
      analyzing: "Analisando...",
    },
    ledger: {
      title: "Registro Anti-Tamper",
      chain: "Cadeia de Custódia",
      verified: "Verificado",
      tampered: "Adulterado",
      hash: "Hash",
      timestamp: "Carimbo de Hora",
    },
  },
};

export { translations };
export default translations;

import { SortDirection } from '../components/client/SortBar';

// 優先度マップ
const statusPriority: Record<string, number> = {
  'active': 1,
  'inactive': 2,
  'suspended': 3
};

const subscriptionPriority: Record<string, number> = {
  'free': 1,
  'basic': 2,
  'premium': 3,
  'enterprise': 4
};

const rolePriority: Record<string, number> = {
  'chipper': 1,
  'company-admin': 2,
  'company-user': 3
};

// 汎用比較関数
export const compareValues = (
  a: any,
  b: any,
  direction: SortDirection,
  type: 'string' | 'number' | 'date' | 'priority' | 'boolean',
  priorityMap?: Record<string, number>
): number => {
  // null/undefined のハンドリング
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  let result = 0;

  switch (type) {
    case 'string':
      // 大文字小文字を無視した日本語ロケール比較
      result = String(a).localeCompare(String(b), 'ja', { sensitivity: 'base' });
      break;
    
    case 'number':
      result = Number(a) - Number(b);
      break;
    
    case 'date':
      const dateA = new Date(a).getTime();
      const dateB = new Date(b).getTime();
      result = dateA - dateB;
      break;
    
    case 'priority':
      if (priorityMap) {
        const priorityA = priorityMap[a] ?? 999;
        const priorityB = priorityMap[b] ?? 999;
        result = priorityA - priorityB;
      }
      break;
    
    case 'boolean':
      // true (enabled) > false (disabled)
      const boolA = a ? 1 : 0;
      const boolB = b ? 1 : 0;
      result = boolB - boolA; // 逆順でenabledが先
      break;
  }

  // 降順の場合は結果を反転
  return direction === 'desc' ? -result : result;
};

// クライアント用のソート関数
export const sortClients = (
  clients: any[],
  sortKey: string,
  direction: SortDirection
): any[] => {
  return [...clients].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    let type: 'string' | 'number' | 'date' | 'priority' | 'boolean' = 'string';
    let priorityMap: Record<string, number> | undefined;

    switch (sortKey) {
      case 'clientName':
        valueA = a.name;
        valueB = b.name;
        type = 'string';
        break;
      
      case 'clientType':
        valueA = a.type;
        valueB = b.type;
        type = 'string';
        break;
      
      case 'totalCompanies':
        valueA = a.companies.length;
        valueB = b.companies.length;
        type = 'number';
        break;
      
      case 'totalSites':
        valueA = a.companies.reduce((sum: number, c: any) => sum + c.sites.length, 0);
        valueB = b.companies.reduce((sum: number, c: any) => sum + c.sites.length, 0);
        type = 'number';
        break;
      
      case 'totalPoints':
        valueA = a.companies.reduce((sum: number, c: any) => sum + c.settings.usage.points, 0);
        valueB = b.companies.reduce((sum: number, c: any) => sum + c.settings.usage.points, 0);
        type = 'number';
        break;
      
      case 'lastUpdated':
        const getLatestUpdate = (client: any) => {
          const dates = client.companies.map((c: any) => new Date(c.updatedAt).getTime());
          return Math.max(...dates);
        };
        valueA = getLatestUpdate(a);
        valueB = getLatestUpdate(b);
        type = 'number';
        break;
      
      default:
        valueA = a.name;
        valueB = b.name;
        type = 'string';
    }

    const result = compareValues(valueA, valueB, direction, type, priorityMap);
    
    // タイブレーク: 同値の場合は名称昇順
    if (result === 0 && sortKey !== 'clientName') {
      return compareValues(a.name, b.name, 'asc', 'string');
    }
    
    return result;
  });
};

// 会社用のソート関数
export const sortCompanies = (
  companies: any[],
  sortKey: string,
  direction: SortDirection,
  getUsagePercentage: (used: number, limit: number) => number
): any[] => {
  return [...companies].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    let type: 'string' | 'number' | 'date' | 'priority' | 'boolean' = 'string';
    let priorityMap: Record<string, number> | undefined;

    switch (sortKey) {
      case 'companyName':
        valueA = a.name;
        valueB = b.name;
        type = 'string';
        break;
      
      case 'status':
        valueA = a.status;
        valueB = b.status;
        type = 'priority';
        priorityMap = statusPriority;
        break;
      
      case 'subscription':
        valueA = a.settings.subscriptionType;
        valueB = b.settings.subscriptionType;
        type = 'priority';
        priorityMap = subscriptionPriority;
        break;
      
      case 'usageSitesPct':
        valueA = getUsagePercentage(a.settings.usage.sites, a.settings.limits.sites);
        valueB = getUsagePercentage(b.settings.usage.sites, b.settings.limits.sites);
        type = 'number';
        break;
      
      case 'usagePointsPct':
        valueA = getUsagePercentage(a.settings.usage.points, a.settings.limits.points);
        valueB = getUsagePercentage(b.settings.usage.points, b.settings.limits.points);
        type = 'number';
        break;
      
      
      case 'pointsUsed':
        valueA = a.settings.usage.points;
        valueB = b.settings.usage.points;
        type = 'number';
        break;
      
      case 'createdAt':
        valueA = a.createdAt;
        valueB = b.createdAt;
        type = 'date';
        break;
      
      case 'updatedAt':
        valueA = a.updatedAt;
        valueB = b.updatedAt;
        type = 'date';
        break;
      
      case 'proxyLogin':
        valueA = a.proxyLoginEnabled;
        valueB = b.proxyLoginEnabled;
        type = 'boolean';
        break;
      
      default:
        valueA = a.name;
        valueB = b.name;
        type = 'string';
    }

    const result = compareValues(valueA, valueB, direction, type, priorityMap);
    
    // タイブレーク: 同値の場合は名称昇順
    if (result === 0 && sortKey !== 'companyName') {
      return compareValues(a.name, b.name, 'asc', 'string');
    }
    
    return result;
  });
};

// 会社用のテーブルビューソート関数
export const sortTableCompanies = (
  companies: any[],
  sortKey: string,
  direction: SortDirection,
  getUsagePercentage: (used: number, limit: number) => number
): any[] => {
  return [...companies].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    let type: 'string' | 'number' | 'date' | 'priority' | 'boolean' = 'string';
    let priorityMap: Record<string, number> | undefined;

    switch (sortKey) {
      
      case 'clientName':
        valueA = a.clientName;
        valueB = b.clientName;
        type = 'string';
        break;
      
      case 'companyName':
        valueA = a.companyName;
        valueB = b.companyName;
        type = 'string';
        break;
      
      case 'subscription':
        valueA = a.settings.subscriptionType;
        valueB = b.settings.subscriptionType;
        type = 'priority';
        priorityMap = subscriptionPriority;
        break;
      
      case 'status':
        valueA = a.status;
        valueB = b.status;
        type = 'priority';
        priorityMap = statusPriority;
        break;
      
      case 'usageSitesPct':
        valueA = getUsagePercentage(a.settings.usage.sites, a.settings.limits.sites);
        valueB = getUsagePercentage(b.settings.usage.sites, b.settings.limits.sites);
        type = 'number';
        break;
      
      case 'usagePointsPct':
        valueA = getUsagePercentage(a.settings.usage.points, a.settings.limits.points);
        valueB = getUsagePercentage(b.settings.usage.points, b.settings.limits.points);
        type = 'number';
        break;
      
      case 'proxyLogin':
        valueA = a.proxyLoginEnabled;
        valueB = b.proxyLoginEnabled;
        type = 'boolean';
        break;
      
      case 'lastLoginDate':
        // ユーザーの最新ログイン日時を取得
        const getLatestLogin = (company: any) => {
          const dates = company.users
            .filter((u: any) => u.lastLoginDate)
            .map((u: any) => new Date(u.lastLoginDate).getTime());
          return dates.length > 0 ? Math.max(...dates) : 0;
        };
        valueA = getLatestLogin(a);
        valueB = getLatestLogin(b);
        type = 'number';
        break;
      
      case 'createdDate':
        // ユーザーの最古作成日を取得
        const getEarliestCreated = (company: any) => {
          const dates = company.users
            .filter((u: any) => u.createdDate)
            .map((u: any) => new Date(u.createdDate).getTime());
          return dates.length > 0 ? Math.min(...dates) : 0;
        };
        valueA = getEarliestCreated(a);
        valueB = getEarliestCreated(b);
        type = 'number';
        break;
      
      case 'lastUpdatedDate':
        // ユーザーの最新更新日時を取得
        const getLatestUpdated = (company: any) => {
          const dates = company.users
            .filter((u: any) => u.lastUpdatedDate)
            .map((u: any) => new Date(u.lastUpdatedDate).getTime());
          return dates.length > 0 ? Math.max(...dates) : 0;
        };
        valueA = getLatestUpdated(a);
        valueB = getLatestUpdated(b);
        type = 'number';
        break;
      
      default:
        valueA = a.name;
        valueB = b.name;
        type = 'string';
    }

    const result = compareValues(valueA, valueB, direction, type, priorityMap);
    
    // タイブレーク: 同値の場合は名称昇順
    if (result === 0 && sortKey !== 'companyName') {
      return compareValues(a.name, b.name, 'asc', 'string');
    }
    
    return result;
  });
};
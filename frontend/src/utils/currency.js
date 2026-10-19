// Currency & Indian Localization Utilities

export const CURRENCY_RATES = {
  INR: 83.0, // 1 USD = ~83 INR
  USD: 1.0
};

/**
 * Formats a monetary amount into INR or USD
 * @param {number} amount - Value in USD baseline
 * @param {'INR' | 'USD'} currency - Active currency
 * @param {boolean} convert - Whether to convert from baseline USD or treat as already converted
 */
export function formatMoney(amount = 0, currency = 'INR', convert = true) {
  const num = Number(amount) || 0;
  const value = convert && currency === 'INR' ? num * CURRENCY_RATES.INR : num;

  if (currency === 'INR') {
    // Format according to Indian numbering system (e.g. ₹1,42,500.00)
    return `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Returns raw numeric value in the active currency for CountUp
 */
export function getConvertedValue(amount = 0, currency = 'INR', convert = true) {
  const num = Number(amount) || 0;
  return convert && currency === 'INR' ? Math.round(num * CURRENCY_RATES.INR * 100) / 100 : num;
}

/**
 * Indian Persona Data Configurations
 */
export const INDIAN_PERSONAS = {
  salaried: {
    id: 'salaried',
    name: 'Rahul Sharma',
    role: 'Senior Tech Lead',
    location: 'Bengaluru, India',
    employer: 'Infosys / Global Tech Hub',
    salaryMonthly: 215000, // ₹2.15 Lakh/mo
    currency: 'INR'
  },
  freelancer: {
    id: 'freelancer',
    name: 'Priya Patel',
    role: 'Independent Product Designer',
    location: 'Mumbai, India',
    employer: 'Global Client Retainers',
    salaryMonthly: 175000,
    currency: 'INR'
  },
  student: {
    id: 'student',
    name: 'Aarav Mehta',
    role: 'CS Student & AI Intern',
    location: 'New Delhi, India',
    employer: 'Campus Stipend & Grants',
    salaryMonthly: 35000,
    currency: 'INR'
  }
};

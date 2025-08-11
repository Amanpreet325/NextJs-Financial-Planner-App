# Financial Application - Form Management System

## Implementation Status

### ✅ Completed Features:
1. **Enhanced Client Edit Dashboard** - Shows progress tracking and form completion status
2. **Progress Tracking API** - Basic structure for tracking form completion
3. **User Creation Enhancement** - Transaction-based user creation with initialization hooks
4. **Visual Progress Indicators** - Cards show completion status with color coding
5. **Next Form Navigation** - "Continue" button to guide admin to next incomplete form

### 🔄 TODO Implementation Guide:

## 1. Database Schema Updates (Prisma Models)

Add these models to your `schema.prisma`:

```prisma
model Questionnaire {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Personal Details
  title             String?
  sex               String?
  firstName         String?
  middleInitial     String?
  lastName          String?
  maritalStatus     String?
  dateOfBirth       DateTime?
  currentAge        Int?
  address           String?
  
  // Employment
  employmentType    String?
  retirementAge     Int?
  
  // Family
  numChildren       Int?
  childrenNames     String?
  
  // Completion tracking
  isCompleted       Boolean  @default(false)
  completedAt       DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model FinancialGoals {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Goals data - adjust based on your form structure
  objectives        String?
  
  isCompleted       Boolean  @default(false)
  completedAt       DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model NetWorth {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Net worth data
  totalAssets       Float?
  totalLiabilities  Float?
  netWorth          Float?
  
  isCompleted       Boolean  @default(false)
  completedAt       DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Add similar models for other forms:
// - CashFlow
// - LifeInsurance
// - MedicalInsurance
// - MutualFunds
// - Equities
// - Bonds
// - PPF
// - RealEstate
// - GoldJewellery
// - TimeDeposits
// - RecurringDeposits
// - DemandDeposits
```

Don't forget to update the User model:
```prisma
model User {
  // ... existing fields
  
  // Relations to forms
  questionnaire     Questionnaire?
  financialGoals    FinancialGoals?
  netWorth          NetWorth?
  cashFlow          CashFlow?
  lifeInsurance     LifeInsurance?
  medicalInsurance  MedicalInsurance?
  mutualFunds       MutualFunds?
  equities          Equities?
  bonds             Bonds?
  ppf               PPF?
  realEstate        RealEstate?
  goldJewellery     GoldJewellery?
  timeDeposits      TimeDeposits?
  recurringDeposits RecurringDeposits?
  demandDeposits    DemandDeposits?
}
```

## 2. Update Progress API

Update `/api/admin/progress/[userId]/route.ts`:

```typescript
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  // ... auth checks
  
  const { userId } = params;

  // Check actual form completion
  const [
    questionnaire,
    financialGoals,
    netWorth,
    cashFlow,
    // ... other forms
  ] = await Promise.all([
    prisma.questionnaire.findFirst({ where: { userId, isCompleted: true } }),
    prisma.financialGoals.findFirst({ where: { userId, isCompleted: true } }),
    prisma.netWorth.findFirst({ where: { userId, isCompleted: true } }),
    prisma.cashFlow.findFirst({ where: { userId, isCompleted: true } }),
    // ... other form checks
  ]);

  const progress = {
    questionnaire: !!questionnaire,
    financialGoals: !!financialGoals,
    netWorth: !!netWorth,
    cashFlow: !!cashFlow,
    // ... other forms
  };

  return NextResponse.json(progress);
}
```

## 3. Initialize Empty Records on User Creation

Update the user creation transaction in `/api/admin/users/route.ts`:

```typescript
const user = await prisma.$transaction(async (tx) => {
  // Create user
  const newUser = await tx.user.create({
    // ... user data
  });

  // Initialize empty form records
  await Promise.all([
    tx.questionnaire.create({
      data: { userId: newUser.id, isCompleted: false }
    }),
    tx.financialGoals.create({
      data: { userId: newUser.id, isCompleted: false }
    }),
    tx.netWorth.create({
      data: { userId: newUser.id, isCompleted: false }
    }),
    // ... other forms
  ]);

  return newUser;
});
```

## 4. Update Form Submission Logic

In each form (questionnaire, financial-goals, etc.), update the submission to mark as completed:

```typescript
const onSubmit = async (data: any) => {
  try {
    const response = await fetch(`/api/admin/questionnaire/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        isCompleted: true,
        completedAt: new Date()
      }),
    });

    if (!response.ok) throw new Error('Failed to save');

    // Navigate to next form or back to dashboard
    const nextForm = getNextIncompleteForm(); // Implement this helper
    if (nextForm) {
      router.push(`${nextForm.path}?userId=${userId}`);
    } else {
      router.push(`/admin/clients/${userId}/edit`);
    }
  } catch (error) {
    console.error('Error saving:', error);
  }
};
```

## 5. Form Navigation Helper

Create a utility file `lib/formNavigation.ts`:

```typescript
export const FORM_ORDER = [
  { key: 'questionnaire', path: '/admin/questionnaire', name: 'Client Questionnaire' },
  { key: 'financialGoals', path: '/admin/financial-goals', name: 'Financial Goals' },
  { key: 'netWorth', path: '/admin/net-worth', name: 'Net Worth' },
  // ... other forms in order
];

export const getNextForm = (currentForm: string, progress: Record<string, boolean>) => {
  const currentIndex = FORM_ORDER.findIndex(form => form.key === currentForm);
  
  for (let i = currentIndex + 1; i < FORM_ORDER.length; i++) {
    if (!progress[FORM_ORDER[i].key]) {
      return FORM_ORDER[i];
    }
  }
  
  return null; // All forms completed
};
```

## 6. Database Migration

After updating your schema, run:
```bash
npx prisma db push
# or
npx prisma migrate dev --name add-form-models
```

## 7. Testing Checklist

- [ ] Create new user → redirects to edit page
- [ ] Edit page shows 0% progress initially
- [ ] Fill questionnaire → shows as completed, progress updates
- [ ] "Continue" button navigates to next incomplete form
- [ ] All forms save data linked to correct userId
- [ ] Progress calculation works correctly
- [ ] Completion status persists across sessions

## Next Steps:
1. Implement the Prisma models
2. Update the progress API with actual checks
3. Add form completion tracking to each form submission
4. Test the complete flow
5. Add error handling and validation

This creates a comprehensive form management system that tracks progress and guides admins through completing all client forms step-by-step!

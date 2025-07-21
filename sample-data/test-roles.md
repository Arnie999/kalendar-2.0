# 🎭 Test Guide - Role System

Návod na testování role-based systému v Payroll Dashboard.

## 🚀 Jak testovat:

1. **Spusťte aplikaci:**
   ```bash
   cd apps/web && npm run dev
   ```

2. **Přejděte na:** http://localhost:3000/payroll

## 🎯 Role a jejich oprávnění:

### 👑 **Boss** (Vedoucí Novák)
- ✅ Vidí všechny zaměstnance a jejich data
- ✅ Může upravovat vše (hodiny, spropitné, odměny, platy)
- ✅ Může importovat Excel soubory
- ✅ Vidí kompletní přehledy a grafy
- ✅ Má přístup ke všem funkcím

### 👤 **Zaměstnanec** (Jan Dvořák)  
- ❌ Vidí pouze svoje směny
- ✅ Může upravovat svoje hodiny, spropitné, odměny, plat
- ❌ Nemůže importovat data
- ❌ Vidí pouze omezené přehledy

### 🍺 **Bar** (Marie Barová)
- ❌ Vidí pouze svoje směny  
- ✅ Může upravovat hodiny, spropitné, odměny
- ❌ Nemůže upravovat plat
- ❌ Nemůže importovat data

### 🍦 **Zmrzlina** (Petr Zmrzlář)
- ❌ Vidí pouze svoje směny
- ✅ Může upravovat hodiny a odměny
- ❌ Nemůže upravovat spropitné ani plat
- ❌ Nemůže importovat data

### 🍳 **Kuchyň** (Anna Kuchařová)  
- ❌ Vidí pouze svoje směny
- ✅ Může upravovat hodiny a odměny
- ❌ Nemůže upravovat spropitné ani plat
- ❌ Nemůže importovat data

### 🧽 **Myčka** (Pavel Myčka)
- ❌ Vidí pouze svoje směny  
- ✅ Může upravovat hodiny a odměny
- ❌ Nemůže upravovat spropitné ani plat
- ❌ Nemůže importovat data

## 🔧 Test scenáře:

### **Test 1: Přepínání rolí**
1. Použijte dropdown "Přepnout roli" 
2. Všimněte si, jak se mění zobrazená data
3. Zkuste editovat různé buňky pro různé role

### **Test 2: Boss vs ostatní**
1. Jako **Boss**: vidíte všechny zaměstnance, všechny sloupce
2. Jako **Bar**: vidíte jen Marie Barovou + spropitné sloupec
3. Jako **Kuchyň**: vidíte jen Annu Kuchařovou + BEZ spropitného sloupce

### **Test 3: Import funkcionalita**  
1. Jako **Boss**: tlačítko "Import dat ze souboru" je viditelné
2. Jako **jiná role**: tlačítko není viditelné nebo je zakázané
3. Zkuste nahrát "směny červenec.xlsx"

### **Test 4: Summary page**
1. Jako **Boss**: vidíte kompletní grafy a statistiky
2. Jako **ostatní**: vidíte pouze "Omezený přehled" s vlastními daty

## 📊 Testovací data:

V aplikaci jsou data pro:
- **Vedoucí Novák** (Boss) - 8h, 0 tips, 500 odměna
- **Jan Dvořák** (Zaměstnanec) - 8h, 150 tips, 200 odměna  
- **Marie Barová** (Bar) - 2 směny s vysokým spropitným
- **Petr Zmrzlář** (Zmrzlina) - bez spropitného
- **Anna Kuchařová** (Kuchyň) - bez spropitného
- **Pavel Myčka** (Myčka) - bez spropitného

## 🎯 Co ověřit:

- [x] Filtrování dat podle role
- [x] Conditional rendering sloupců (tips/bonus)
- [x] Editovatelnost buněk podle oprávnění  
- [x] Import dostupný jen pro Boss
- [x] Summary page permissions
- [x] Role switcher funguje správně

## 🔄 Excel import:

Váš soubor `směny červenec.xlsx` bude fungovat s automatickým mapováním sloupců! 
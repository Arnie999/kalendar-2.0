# Ukázkové soubory pro import směn

Tento adresář obsahuje ukázkové soubory pro testování import funkcionality payroll dashboardu.

## 📁 Soubory:

### `shifts-example.csv`
- **Formát**: CSV s anglickými hlavičkami
- **Sloupce**: date, employee, hours, tips, bonus
- **Použití**: Základní testování importu

### `shifts-cesky.csv` 
- **Formát**: CSV s českými hlavičkami  
- **Sloupce**: datum, zamestnanec, hodiny, spropitne, premia
- **Použití**: Test vícejazyčného mapování sloupců

## 🔧 Jak používat:

1. Přejděte na http://localhost:3000/payroll
2. Klikněte "Import Shift Data"
3. Přetáhněte nebo vyberte jeden z těchto souborů
4. Zkontrolujte náhled dat
5. Klikněte "Import X Entries"

## 📊 Struktura dat:

- **Date**: Datum směny (YYYY-MM-DD nebo DD.MM.YYYY)
- **Employee**: Jméno zaměstnance
- **Hours**: Počet odpracovaných hodin (může být decimální, např. 7.5)
- **Tips**: Spropitné v CZK
- **Bonus**: Bonusy/prémiové odměny v CZK

## 🧪 Testování:

Tyto soubory pokrývají různé scénáře:
- Různé formáty datumu
- Vícejazyčné hlavičky sloupců
- Decimální hodnoty hodin
- Různé částky spropitného a bonusů
- Opakující se zaměstnanci v různých dnech

## 🚀 Vytvořte vlastní soubor:

Pro vytvoření vlastního testovacího souboru použijte stejnou strukturu a uložte jako .csv nebo .xlsx soubor. 
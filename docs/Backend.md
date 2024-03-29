# Содержание

[Документация](./Документация.md)

# Серверная часть
**Технологии:** ASP.NET Core;

**Функционал:**
- Получение данных из [базы данных](./База данных.md);
- Обработка данных;
- Предоставление API интерфейса для приложения, в частности для [web-интерфейса](./Frontend.md).

## Получение данных из базы данных
> [!WARNING]
> **Запрещена** любая вставка или удаление данных из базы данных.


## Обработка данных
### Получение дерева объектов товарного парка
> [!INFO]
> У каждого товарного парка имеется главный элемент, от которого происходит все дерево до скважин включительно.

**Алгоритм:**
1. Получение главного элемента дерева;
2. Получить идентификатор главного элемента дерева;
3. Получить список объектов, указывающие полученный идентификатор;
4. Получить идентификатор следующего объекта объекта дерева по порядку;
5. Вернуться к третьему пункту, если список объектов, указывающих полученный идентификатор последнего объекта дерева, не пуст (что означает, что у последнего объекта в дереве имеются объекты уровнем ниже него).

### Перестройка связей согласно списку типов объектов



## API-интерфейс
**API-интерфейс предоставляет следующие возможности:**
- Получение списка главных товарных парков, от которых строится все дерево товарного парка;
- Получение дерева группировки типов объектов товарного парка;
> [!INFO]
> Дерево группировки типов является стандартизированной, поэтому неизменной.

- Получение дерева товарного парка согласно выбранным типам объектам из дерева группировки типов объектов товарного парка;
> [!NOTE]
> По причине непонимания способа получения массива чисел был выбран способ получения строки чисел с ';' разделителем, который в последующем разбивается на массив чисел.

- Получение дополнительной информации об объекте товарного парка.
> [!INFO]
> Получает идентификатор объекта для его нахождения в базе данных

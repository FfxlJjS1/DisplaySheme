using System;
using System.Collections.Generic;

namespace webapi;

/// <summary>
/// Таблица Тип Скважины
/// </summary>
public partial class Kat
{
    public int KatId { get; set; }

    public string Name { get; set; } = null!;

    public string Name2 { get; set; } = null!;

    public virtual ICollection<Scw> Scws { get; set; } = new List<Scw>();
}

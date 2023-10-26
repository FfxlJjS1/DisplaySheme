using System;
using System.Collections.Generic;

namespace webapi;

/// <summary>
/// Таблица Тип состояния
/// </summary>
public partial class PrSost
{
    public int PrSostId { get; set; }

    public string Name { get; set; } = null!;

    public string Name2 { get; set; } = null!;

    public virtual ICollection<Scw> Scws { get; set; } = new List<Scw>();
}

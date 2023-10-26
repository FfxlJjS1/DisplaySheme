using System;
using System.Collections.Generic;

namespace webapi;

/// <summary>
/// Таблица Тип Объектов
/// </summary>
public partial class TipNpo
{
    public int TipNpoId { get; set; }

    public string Name { get; set; } = null!;

    public string Name2 { get; set; } = null!;

    public virtual ICollection<Npo> Npos { get; set; } = new List<Npo>();

    public virtual ICollection<Scheme> SchemeParentTipNpos { get; set; } = new List<Scheme>();

    public virtual ICollection<Scheme> SchemeTipNpos { get; set; } = new List<Scheme>();
}

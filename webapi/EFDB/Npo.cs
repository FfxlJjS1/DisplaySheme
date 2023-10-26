using System;
using System.Collections.Generic;

namespace webapi;

/// <summary>
/// Таблица Объектов
/// </summary>
public partial class Npo
{
    public int NpoId { get; set; }

    public int? ParentId { get; set; }

    public int TipNpoId { get; set; }

    public string Name { get; set; } = null!;

    public string? Name2 { get; set; }

    public int? ObjId { get; set; }

    public virtual ICollection<Scheme> SchemeNpos { get; set; } = new List<Scheme>();

    public virtual ICollection<Scheme> SchemeParentNpos { get; set; } = new List<Scheme>();

    public virtual TipNpo TipNpo { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace webapi;

/// <summary>
/// Таблица Схема
/// </summary>
public partial class Scheme
{
    public int Id { get; set; }

    public int ParentId { get; set; }

    public int? ParentTipNpoId { get; set; }

    public int? ParentNpoId { get; set; }

    public int TipNpoId { get; set; }

    public string? Ctip { get; set; }

    public string? Nam { get; set; }

    public int NpoId { get; set; }

    public int FlSx { get; set; }

    public virtual Npo Npo { get; set; } = null!;

    public virtual Npo? ParentNpo { get; set; }

    public virtual TipNpo? ParentTipNpo { get; set; }

    public virtual TipNpo TipNpo { get; set; } = null!;
}

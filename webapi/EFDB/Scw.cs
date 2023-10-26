using System;
using System.Collections.Generic;

namespace webapi;

/// <summary>
/// Таблица Скважины
/// </summary>
public partial class Scw
{
    public int ScwId { get; set; }

    public int Cex { get; set; }

    public int Zona { get; set; }

    public int KatId { get; set; }

    public int PrSostId { get; set; }

    public virtual Kat Kat { get; set; } = null!;

    public virtual PrSost PrSost { get; set; } = null!;
}

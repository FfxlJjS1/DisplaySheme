using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace webapi;

public partial class DbCollectionContext : DbContext
{
    public DbCollectionContext()
    {
    }

    public DbCollectionContext(DbContextOptions<DbCollectionContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Kat> Kats { get; set; }

    public virtual DbSet<Npo> Npos { get; set; }

    public virtual DbSet<PrSost> PrSosts { get; set; }

    public virtual DbSet<Scheme> Schemes { get; set; }

    public virtual DbSet<Scw> Scws { get; set; }

    public virtual DbSet<TipNpo> TipNpos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=db_collection;Username=postgres;Password=12345");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Kat>(entity =>
        {
            entity.HasKey(e => e.KatId).HasName("kat_pk");

            entity.ToTable("kat", tb => tb.HasComment("Таблица Тип Скважины"));

            entity.Property(e => e.KatId)
                .ValueGeneratedNever()
                .HasColumnName("kat_id");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .HasColumnName("name");
            entity.Property(e => e.Name2)
                .HasMaxLength(100)
                .HasColumnName("name2");
        });

        modelBuilder.Entity<Npo>(entity =>
        {
            entity.HasKey(e => e.NpoId).HasName("npo_pk");

            entity.ToTable("npo", tb => tb.HasComment("Таблица Объектов"));

            entity.Property(e => e.NpoId).HasColumnName("npo_id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Name2)
                .HasMaxLength(255)
                .HasColumnName("name2");
            entity.Property(e => e.ObjId).HasColumnName("obj_id");
            entity.Property(e => e.ParentId).HasColumnName("parent_id");
            entity.Property(e => e.TipNpoId).HasColumnName("tip_npo_id");

            entity.HasOne(d => d.TipNpo).WithMany(p => p.Npos)
                .HasForeignKey(d => d.TipNpoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("npo_fk1");
        });

        modelBuilder.Entity<PrSost>(entity =>
        {
            entity.HasKey(e => e.PrSostId).HasName("pr_sost_pk");

            entity.ToTable("pr_sost", tb => tb.HasComment("Таблица Тип состояния"));

            entity.Property(e => e.PrSostId)
                .ValueGeneratedNever()
                .HasColumnName("pr_sost_id");
            entity.Property(e => e.Name)
                .HasMaxLength(10)
                .HasColumnName("name");
            entity.Property(e => e.Name2)
                .HasMaxLength(255)
                .HasColumnName("name2");
        });

        modelBuilder.Entity<Scheme>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("scheme_pk");

            entity.ToTable("scheme", tb => tb.HasComment("Таблица Схема"));

            entity.Property(e => e.Id).HasColumnName("_id");
            entity.Property(e => e.Ctip)
                .HasMaxLength(100)
                .HasColumnName("ctip");
            entity.Property(e => e.FlSx).HasColumnName("fl_sx");
            entity.Property(e => e.Nam)
                .HasMaxLength(100)
                .HasColumnName("nam");
            entity.Property(e => e.NpoId).HasColumnName("npo_id");
            entity.Property(e => e.ParentId).HasColumnName("parent_id");
            entity.Property(e => e.ParentNpoId).HasColumnName("parent_npo_id");
            entity.Property(e => e.ParentTipNpoId).HasColumnName("parent_tip_npo_id");
            entity.Property(e => e.TipNpoId).HasColumnName("tip_npo_id");

            entity.HasOne(d => d.Npo).WithMany(p => p.SchemeNpos)
                .HasForeignKey(d => d.NpoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("scheme_fk2");

            entity.HasOne(d => d.ParentNpo).WithMany(p => p.SchemeParentNpos)
                .HasForeignKey(d => d.ParentNpoId)
                .HasConstraintName("scheme_fk3");

            entity.HasOne(d => d.ParentTipNpo).WithMany(p => p.SchemeParentTipNpos)
                .HasForeignKey(d => d.ParentTipNpoId)
                .HasConstraintName("scheme_fk4");

            entity.HasOne(d => d.TipNpo).WithMany(p => p.SchemeTipNpos)
                .HasForeignKey(d => d.TipNpoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("scheme_fk1");
        });

        modelBuilder.Entity<Scw>(entity =>
        {
            entity.HasKey(e => e.ScwId).HasName("scw_pk");

            entity.ToTable("scw", tb => tb.HasComment("Таблица Скважины"));

            entity.Property(e => e.ScwId).HasColumnName("scw_id");
            entity.Property(e => e.Cex).HasColumnName("cex");
            entity.Property(e => e.KatId).HasColumnName("kat_id");
            entity.Property(e => e.PrSostId).HasColumnName("pr_sost_id");
            entity.Property(e => e.Zona).HasColumnName("zona");

            entity.HasOne(d => d.Kat).WithMany(p => p.Scws)
                .HasForeignKey(d => d.KatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("scw_fk1");

            entity.HasOne(d => d.PrSost).WithMany(p => p.Scws)
                .HasForeignKey(d => d.PrSostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("scw_fk2");
        });

        modelBuilder.Entity<TipNpo>(entity =>
        {
            entity.HasKey(e => e.TipNpoId).HasName("tip_npo_pk");

            entity.ToTable("tip_npo", tb => tb.HasComment("Таблица Тип Объектов"));

            entity.Property(e => e.TipNpoId)
                .ValueGeneratedNever()
                .HasColumnName("tip_npo_id");
            entity.Property(e => e.Name)
                .HasMaxLength(10)
                .HasColumnName("name");
            entity.Property(e => e.Name2)
                .HasMaxLength(255)
                .HasColumnName("name2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

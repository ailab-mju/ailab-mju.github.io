'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { asset, type Album } from '@/lib/types';

const src = (id: string, file: string) => asset(`/images/gallery/${id}/${file}`);
const thumb = (id: string, file: string) => asset(`/images/gallery/${id}/thumb/${file}`);

export default function Gallery({ albums }: { albums: Album[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const album = albums.find((a) => a.id === openId) ?? null;
  const total = album?.photos.length ?? 0;

  const close = useCallback(() => {
    setOpenId(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      if (!total) return;
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  // 배경 스크롤 잠금
  useEffect(() => {
    if (!album) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [album]);

  // 키보드: ESC 닫기, 좌우 이동
  useEffect(() => {
    if (!album) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [album, close, step]);

  if (albums.length === 0) {
    return (
      <div className="albums">
        <div className="empty">
          No albums yet.
          <br />
          <br />
          <span style={{ fontSize: 13 }}>
            Drop photos into <code>raw-photos/&#123;album-id&#125;/</code> and the upload
            workflow will resize them, strip EXIF, and add the album here.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="albums">
        {albums.map((a) => (
          <button
            key={a.id}
            type="button"
            className="album"
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setIndex(0);
              setOpenId(a.id);
            }}
          >
            <div className="album-i">
              {a.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb(a.id, a.cover)} alt="" loading="lazy" />
              ) : (
                `${a.photos.length} photos`
              )}
            </div>
            <div className="album-m">
              <div className="album-d">{a.date}</div>
              <div className="album-t">{a.title}</div>
              {a.caption && <div className="album-c">{a.caption}</div>}
            </div>
          </button>
        ))}
      </div>

      {album && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={album.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="lb-t">
            <div>
              <h3>{album.title}</h3>
              <p>
                {album.date}
                {album.caption ? ` · ${album.caption}` : ''} · {index + 1} / {total}
              </p>
            </div>
            <button ref={closeRef} type="button" className="lb-x" aria-label="Close" onClick={close}>
              ×
            </button>
          </div>

          {/* 사진 바깥의 빈 영역도 배경으로 취급한다. .lb 자체는 padding 20px 밖에
              직접 클릭될 수 없어 배경 클릭이 사실상 동작하지 않는다. */}
          <div
            className="lb-s"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <button type="button" className="lb-nav" aria-label="Previous photo" onClick={() => step(-1)}>
              ‹
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src(album.id, album.photos[index])} alt={`${album.title} ${index + 1}`} />
            <button type="button" className="lb-nav" aria-label="Next photo" onClick={() => step(1)}>
              ›
            </button>
          </div>

          <div className="lb-r">
            {album.photos.map((file, i) => (
              <button
                key={file}
                type="button"
                className={i === index ? 'on' : undefined}
                aria-label={`Photo ${i + 1}`}
                onClick={() => setIndex(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(album.id, file)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

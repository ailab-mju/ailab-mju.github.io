'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import AwardName from './AwardName';
import { asset, type Album } from '@/lib/types';

const src = (id: string, file: string) => asset(`/images/gallery/${id}/${file}`);
const thumb = (id: string, file: string) => asset(`/images/gallery/${id}/thumb/${file}`);

export default function Gallery({ albums }: { albums: Album[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
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

  // 배경 스크롤 잠금 + 배경 비활성화.
  //
  // aria-modal="true" 만으로는 뒤 페이지가 잠기지 않는다. inert 를 걸지 않으면
  // Tab 여섯 번에 포커스가 스킵 링크·내비로 빠져나가는데, 스크롤은 잠겨 있어서
  // 사용자는 보이지도 않는 요소에 포커스를 두게 된다.
  useEffect(() => {
    if (!album) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    // 다이얼로그에서 body 까지 거슬러 올라가며 각 층의 형제를 전부 잠근다.
    // body 자식만 잠그면 같은 <main> 안에 있는 앨범 버튼들이 그대로 남는다.
    const locked: Element[] = [];
    let node: HTMLElement | null = dialogRef.current;
    for (; node && node !== document.body; node = node.parentElement) {
      for (const sibling of node.parentElement?.children ?? []) {
        if (sibling !== node && !sibling.hasAttribute('inert')) {
          sibling.setAttribute('inert', '');
          locked.push(sibling);
        }
      }
    }

    return () => {
      document.body.style.overflow = prev;
      for (const el of locked) el.removeAttribute('inert');
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
          <span className="empty-h">
            Photos appear here once someone adds them to the shared album folder.
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
                <img
                  src={thumb(a.id, a.cover)}
                  alt=""
                  width={400}
                  height={300}
                  loading="lazy"
                />
              ) : (
                `${a.photos.length} photos`
              )}
            </div>
            <div className="album-m">
              <div className="album-d">{a.date}</div>
              <div className="album-t">{a.title}</div>
              {a.caption && <div className="album-c">{a.caption}</div>}
              {a.awards.length > 0 && (
                // 카드에서는 영문 이름까지만. 원어 표기는 자리가 있는 라이트박스에서.
                <div className="album-aw">
                  {a.awards.map((w) => (
                    <span key={`${w.date}-${w.title}`}>
                      {w.title} · {w.member}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {album && (
        <div
          ref={dialogRef}
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
              {album.awards.length > 0 && (
                <p className="lb-aw">
                  {album.awards.map((w) => (
                    <span key={`${w.date}-${w.title}`}>
                      <AwardName award={w} /> · {w.member}
                    </span>
                  ))}
                </p>
              )}
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
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(album.id, file)} alt="" width={72} height={52} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

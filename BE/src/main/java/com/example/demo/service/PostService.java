package com.example.demo.service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.post.PostCreateRequest;
import com.example.demo.dto.post.PostResponse;
import com.example.demo.dto.post.PostUpdateRequest;
import com.example.demo.entities.Foto;
import com.example.demo.entities.Poi;
import com.example.demo.entities.Post;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.FotoRepository;
import com.example.demo.repository.PoiRepository;
import com.example.demo.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final FotoRepository fotoRepository;
    private final PoiRepository poiRepository;

    @Transactional
    public PostResponse create(PostCreateRequest request) {
        Post post = new Post();
        post.setTitolo(request.getTitolo());
        post.setDescrizione(request.getDescrizione());
        post.setCreatedAt(Instant.now());
        post.setPoi(resolvePoi(request.getIdPoi()));
        post = postRepository.save(post);

        List<Foto> foto = syncFoto(post, request.getIdFoto());

        return toResponse(post, foto);
    }

    public List<PostResponse> findAll() {
        return postRepository.findAll().stream()
                .map(post -> toResponse(post, fotoRepository.findAllByPostId(post.getId())))
                .toList();
    }

    public PostResponse findById(UUID id) {
        Post post = getPostOrThrow(id);
        return toResponse(post, fotoRepository.findAllByPostId(id));
    }

    @Transactional
    public PostResponse update(UUID id, PostUpdateRequest request) {
        Post post = getPostOrThrow(id);

        if (request.getTitolo() != null) {
            post.setTitolo(request.getTitolo());
        }
        if (request.getDescrizione() != null) {
            post.setDescrizione(request.getDescrizione());
        }
        if (request.getIdPoi() != null) {
            post.setPoi(resolvePoi(request.getIdPoi()));
        }
        post = postRepository.save(post);

        List<Foto> foto = syncFoto(post, request.getIdFoto());

        return toResponse(post, foto);
    }

    @Transactional
    public void delete(UUID id) {
        Post post = getPostOrThrow(id);

        fotoRepository.deleteAll(fotoRepository.findAllByPostId(id));

        Poi poi = post.getPoi();
        postRepository.delete(post);

        if (poi != null) {
            poiRepository.deleteById(poi.getId());
        }
    }

    private Post getPostOrThrow(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post non trovato con id " + id));
    }

    private Poi resolvePoi(UUID idPoi) {
        if (idPoi == null) {
            return null;
        }
        return poiRepository.findById(idPoi)
                .orElseThrow(() -> new ResourceNotFoundException("POI non trovato con id " + idPoi));
    }

    /**
     * idFoto == null  -> nessuna modifica, ritorna le foto attualmente collegate.
     * idFoto (anche vuota) -> sostituisce in blocco le foto collegate al post.
     */
    private List<Foto> syncFoto(Post post, List<UUID> idFoto) {
        if (idFoto == null) {
            return fotoRepository.findAllByPostId(post.getId());
        }

        List<Foto> nuoveFoto = idFoto.isEmpty() ? List.of() : fotoRepository.findAllById(idFoto);
        if (nuoveFoto.size() != idFoto.size()) {
            throw new ResourceNotFoundException("Una o più foto specificate non esistono");
        }

        Set<UUID> idRichiesti = new HashSet<>(idFoto);
        List<Foto> fotoPrecedenti = fotoRepository.findAllByPostId(post.getId());
        fotoPrecedenti.stream()
                .filter(f -> !idRichiesti.contains(f.getId()))
                .forEach(f -> f.setPost(null));
        fotoRepository.saveAll(fotoPrecedenti);

        nuoveFoto.forEach(f -> f.setPost(post));
        return fotoRepository.saveAll(nuoveFoto);
    }

    private PostResponse toResponse(Post post, List<Foto> foto) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitolo(post.getTitolo());
        response.setDescrizione(post.getDescrizione());
        response.setCreatedAt(post.getCreatedAt());
        response.setIdPoi(post.getPoi() != null ? post.getPoi().getId() : null);
        response.setIdFoto(foto.stream().map(Foto::getId).toList());
        return response;
    }
}

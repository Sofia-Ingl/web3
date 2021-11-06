package beans;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.Query;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class EntryBeansContainer implements Serializable {

    private List<EntryBean> entryBeansContainer;
    private EntryBean currentEntry;

    private EntityManager entityManager;
    private EntityTransaction transaction;


    public EntryBeansContainer() {
        System.out.println("Created!");
        entryBeansContainer = new ArrayList<>();
        //establishConnectionWithDB();
        //loadAllEntries();
        currentEntry = new EntryBean();
    }

    private void establishConnectionWithDB() {
        entityManager = Persistence.createEntityManagerFactory("persist").createEntityManager();
        transaction = entityManager.getTransaction();
    }

    private void loadAllEntries() {
        try {
            transaction.begin();
            Query query = entityManager.createQuery("SELECT e FROM EntryBean e");
            entryBeansContainer = query.getResultList();
            transaction.commit();
        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw e;
        }
    }

    public void addEntry() {
//        try {
//            transaction.begin();
        System.out.println("Add");
        currentEntry.checkIfHit();
        entryBeansContainer.add(currentEntry);
        currentEntry = new EntryBean();
//            entityManager.persist(currentEntry);
//            transaction.commit();
//        } catch (Exception e) {
//            if (transaction.isActive()) {
//                transaction.rollback();
//            }
//            throw e;
//        }
    }

    public void clearEntries() {
//        try {
//            transaction.begin();
//            Query query = entityManager.createQuery("DELETE FROM EntryBean");
//            query.executeUpdate();
        entryBeansContainer.clear();
//            transaction.commit();
//        } catch (RuntimeException exception) {
//            if (transaction.isActive()) {
//                transaction.rollback();
//            }
//            throw exception;
//        }
    }

    public EntryBean getCurrentEntry() {
        return currentEntry;
    }


//    public EntryBeansContainer(List<EntryBean> entryBeans) {
//        this.entryBeansContainer = entryBeans;
//    }

    public List<EntryBean> getEntryBeansContainer() {
        return entryBeansContainer;
    }

//    public void setEntryBeansContainer(List<EntryBean> entryBeansContainer) {
//        this.entryBeansContainer = entryBeansContainer;
//    }

}
